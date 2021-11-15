// const HandleParams: Function = function(req, res, next) {
//     // console.log('middleware1');
//     next()
// }
import { CLASS_DECORATE_KEYS, CUSTOM_VALIDATE } from "../validates/consts"

const HandleParams: Function = (v: any) => {
    const { queryList, bodyList, customList } = v
    return (req, res, next) => {
        const { body, query } = req
        /** 处理参数 */
        let list = null;
        if (queryList?.length || bodyList?.length || customList?.length) {
            list = []
            queryList?.length && (list = queryList)
            bodyList?.length && (list = list.concat(bodyList))
            customList?.length && (list = list.concat(customList))

            list = list.sort((a: any, b: any) => a.index - b.index)
        }
        /** 处理参数end */

        /**
         * 处理实际参数
         */
        let newlists = []
        list && (newlists = list.map(key => {
            if (key.type === 'Query') {
                if (key.param) return query?.[key.param]
                else return query
            } else if (key.type === 'Body') {
                if (key.param) return body?.[key.param]
                else return body
            } else if (key.type === 'Custom') {
                const value = key.fn.call(null, { request: req, response: res }, key.param)
                return value
            }    
        }))

        req.newlists = newlists

        next()
    }
}

/**
 * 处理自定义验证参数
 * @param v 解析后的路有对象
 * @returns 
 */
const HandleValidateParams: Function = (v: any) => {
    const validateparams = v
    return (req, res, next) => {
        console.log('params_valid')
        const { newlists } = req;
        let paramsErr = false
        let err = null
        /** 在此处执行验证逻辑 START*/
        if (validateparams?.length) {
            for(const vc of validateparams) {
                if (paramsErr) break
                const valid = newlists?.[vc.index]
                if (!valid) throw Error('参数不能为空')

                const keys = Reflect.getMetadata(CLASS_DECORATE_KEYS, vc.constr.prototype)
                if (!keys?.length) continue

                for (const name of keys) {
                    if (paramsErr) break
                    const list = Reflect.getMetadata(CUSTOM_VALIDATE, vc.constr.prototype, name)
                    // console.log('list-1', list)
                    if (list?.length) {
                        for (const item of list) {
                            if (paramsErr) break
                            const { fn, message } = item
                            const flag = fn.call(null, valid[name])
                            if (flag) {
                                paramsErr = true
                                err = {success: false, code: 400, message: `${name}: ${message}`}
                                // res.send({success: false, code: 400, message: `${name}: ${message}`})
                                break
                            }
                        }   
                    }
                }
            }

        }
        /** 在此处执行验证逻辑 END*/
        if (paramsErr) res.send(err)
        else next()
    }
}

export { HandleParams, HandleValidateParams }