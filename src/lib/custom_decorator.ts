import { Custom } from "./common";

/**
 * 自定义参数装饰器，参数处理
 * @params { Ctx } 上下文环境
 * @params { String } 快捷取值函数 => 从 request['headers'] 中取值
 */
const Headers = Custom(function(ctx, key) {
    const headers = ctx?.request?.headers
    return key ? headers?.[key] ?? '' : headers ?? null
})

const Context = Custom(function(ctx) {
    return ctx
})

const Req = Custom(function(ctx, key) {
    return key ? ctx?.request?.[key] : ctx?.request
})

const Res = Custom(function(ctx, key) {
    return key ? ctx?.response?.[key] : ctx?.response
})

export { Headers, Context, Req, Res }