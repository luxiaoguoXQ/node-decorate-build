import 'reflect-metadata'
import { HandleValidateParams } from '../middleware/handle'

type Construct<T = any> = new(...args: Array<any>) => T

interface Route {
    route: string;
    method: string;
    fn: Function;
    queryList: Array<any>;
    bodyList: Array<any>;
    customList: Array<any>;
    methodName: string;
    middlewares: Array<any>;
    // validateparams: Array<any>;
    pipefunction: Function;
}

/**
 * 声明 Injectable 装饰器，当为类声明装饰该装饰器时则表示该类是可注入的类
 * @param constructor 构造函数
 */
function Injectable<T>(constructor: Construct<T>) {}

/**
 * 带有参数的注入装饰器工厂，用法待定... 暂时用不到
 * @param name 注入的标识
 * @returns {Function} 类装饰器
 */
function Inject(name: string): Function {
    return function<T>(constructor: Construct<T>) {}
}

// 声明 Controller 装饰器，当为类声明装饰器装饰器时则表示该类是控制器模块
// function Controller<T>(constructor: Construct<T>) {}

/**
 * 建立Controller装饰器函数
 * @param path 路径(路由的一部分)
 * @returns {Function} 装饰器工厂(针对方法)
 */
function Controller(path: string): Function {
    return function<T>(constructor: Construct<T>) {
        const path_h = path?.includes('/') ? path : `/${path}`
        Reflect.defineMetadata('path', path_h, constructor)
    }
}

/**
 * 一个工厂函数，根据传入的请求方法类型来返回一个该类型的装饰器工厂函数
 * @param method 请求方式
 * @returns {Function} 装饰器工厂
 */
function createMethodsDecorator(method: string): Function {
    return function(routeName: string): Function {
        return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
            // @Get之类的装饰器会装饰实例方法。因此，为该实例方法设定元数据route路由路径和method请求方法
            const route_name = routeName?.includes('/') ? routeName : `/${routeName}`
            Reflect.defineMetadata('route', route_name, target, propertyName)
            Reflect.defineMetadata('method', method, target, propertyName)
        }
    }
}

/**
 * 修饰中间件
 * @param method 'Middleware'
 * @returns {Function} function
 */
function createMethodsMiddlewareDecorator(method: string): Function {
    return function(fn: Function): Function {
        return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
            let middles = Reflect.getOwnMetadata(method, target, propertyName);
            if (!middles?.length) middles = [];
            middles.push(fn);
            Reflect.defineMetadata(method, middles, target, propertyName);
        }
    }  
}

/**
 * 参数验证装饰器(待进一步封装)
 * @returns 
 */
 function ValidateParams() {
    return function(construct: any, propertyName: string, descriptor: PropertyDescriptor) {

        const params = Reflect.getMetadata('design:paramtypes', construct, propertyName)
        // console.log('params', params)
        let middles = Reflect.getOwnMetadata('Middleware', construct, propertyName);

        const BASETYPE: Function[] = [Number, String, Object, Array, Boolean];

        let validParamsCollections: Array<any> = [];
        for (let i = 0; i < params.length; i++) {
            const v = params[i]
            if (!BASETYPE.includes(v)) {
                validParamsCollections.push({
                    constr: v,
                    index: i
                })
            }
        } 

        if (!middles?.length) middles = [];
        middles.push(HandleValidateParams(validParamsCollections))
        Reflect.defineMetadata('Middleware', middles, construct, propertyName);
        // Reflect.defineMetadata('validate:params', validParamsCollections, construct, propertyName)
    }
}

/**
 * 修饰返回数据(需要改造，放到server.ts中执行) TODO
 * @param fn fn
 * @returns 
 */
function Pipe(fn) {
    return function(construct: any, propertyName: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('pipe:function', fn, construct, propertyName)
    }
}

/**
 * 一个工厂函数， 根据传入的请求方法类型来返回一个该类型的装饰器工厂函数
 * @param method 请求方式
 * @returns {Function} 工厂装饰器
 */
function createParamsDecorator(method: string): Function {
    // const queryList: Array<any> = [];
    return function(param: string): Function {
        return function(target: any, propertyName: string, parameterIndex: number) {
            const index = parameterIndex
            // console.log('index', index)
            let queryList = Reflect.getOwnMetadata(method, target, propertyName)
            if (!queryList) queryList = []
            const v = {
                param,
                index,
                type: method,
            }
            queryList.push(v)
            // TODO
            Reflect.defineMetadata(method, queryList, target, propertyName)
        }
    }
}

/**
 * 创建一个自定义参数装饰器工厂
 * @param method 方法名
 * @returns {Function} 工厂装饰器
 */
function createCustomParamsDecorator(method: string): Function {
    return function CreateCustomParams(fn: Function) {
        return function(param: string): Function {
            return function(target: any, propertyName: string, parameterIndex: number) {
                const index = parameterIndex
                let customList = Reflect.getOwnMetadata(method, target, propertyName)
                if (!customList) customList = []
                const v = {
                    param,
                    index,
                    fn,
                    type: method,
                }
                customList.push(v)
                // TODO
                Reflect.defineMetadata(method, customList, target, propertyName)
            }
        }
    }
}

/**
 * 路径信息解析函数，传入的参数为控制器类，返回该控制器的所有路由信息
 * @param constructor 构造函数
 * @returns {Object} 解析的对象
 */
function mapRoute<T>(constructor: Construct<T>) {
    // 得到控制器路径，即@Controller()中的参数值
    const pathName = Reflect.getMetadata('path', constructor)
    const routes: Array<Object> = []
    const proto = constructor.prototype

    // 过滤掉类的原型中不是函数的属性
    const funcs = Object.keys(proto).filter(item => (typeof proto[item] === 'function'))

    funcs.forEach(funcName => {
        /**
         * 在这里面调整中间件的顺序
         */
        // console.log('funcName', funcName)
        // 得到@Get()中的参数值
        let route = Reflect.getMetadata('route', proto, funcName)
        route = pathName + route

        // 得到为该方法设定的允许请求方法
        const method = Reflect.getMetadata('method', proto, funcName)
        const fn = proto[funcName]

        // 得到路由上的参数设置
        const queryList = Reflect.getOwnMetadata('Query', proto, funcName)
        // console.log('queryList', queryList)
        
        // 得到Body体参数
        const bodyList = Reflect.getOwnMetadata('Body', proto, funcName)

        // 得到自定义参数装饰器
        const customList = Reflect.getOwnMetadata('Custom', proto, funcName)

        /** Handle - 将管道、中间件、拦截器、参数校验器 处理成 中间件; 按照顺序执行 */

        // 得到middleware
        const middlewareList = Reflect.getOwnMetadata('Middleware', proto, funcName)

        console.log('middles', middlewareList)

        // 得到参数校验 validateparams
        // const validateparams = Reflect.getOwnMetadata('validate:params', proto, funcName)

        // 得到管道 pipefunction
        const pipefunction = Reflect.getOwnMetadata('pipe:function', proto, funcName)

        const routeMes: Route = {
            route,
            method,
            fn,
            queryList,
            bodyList,
            customList,
            methodName: funcName,
            middlewares: middlewareList,
            // validateparams,
            pipefunction
        }

        routes.push(routeMes)
    })

    return {
        pathName,
        routes
    }
}

const provideWeakMap = new Map()

/**
 * 声明简单的 IO C容器，用来将对象创建的控制器反转
 * @param constructor 构造器
 * @returns {Object} 返回类的实例
 */
function Factory<T>(constructor: Construct<T>): T {
    const paramtypes = Reflect.getMetadata('design:paramtypes', constructor)

    const providers = paramtypes && paramtypes.map((provider: Construct<T>) => {
        // console.log('provider', provider.toString())
        const provideKey = provider.toString()
        if (provideWeakMap[provideKey]) return provideWeakMap[provideKey]
        else {
            const v = Factory(provider)
            provideWeakMap[provideKey] = v
            return v
        }
    })

    return providers ? (new constructor(...providers)) : (new constructor())
}

// 通过上述工厂函数得到装饰器工厂函数

const Get = createMethodsDecorator('GET')
const Post = createMethodsDecorator('POST')

const Query = createParamsDecorator('Query')
const Body = createParamsDecorator('Body')

const Custom = createCustomParamsDecorator('Custom')

const Middleware = createMethodsMiddlewareDecorator('Middleware')





export { Injectable, Controller, Middleware, Get, Post, Query, Body, Custom, Factory, mapRoute, ValidateParams, Pipe, Inject }