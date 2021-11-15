/** 标准化中间件 */
const auth: Function = async function(req, res, next) {
    console.log('middleware-auth');
    await next()
    console.log('middleware-auth-next')
}

const inspect: Function = async function(req, res, next) {
    console.log('middleware-inspect');
    await next()
    console.log('middleware-inspect-next')
}

export { auth, inspect }