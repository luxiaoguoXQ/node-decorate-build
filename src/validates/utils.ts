import { CUSTOM_VALIDATE, CLASS_DECORATE_KEYS } from './consts'

export function FactoryValid({ message, value }, fn) {
    return function(target, name) {
        let keys = Reflect.getMetadata(CLASS_DECORATE_KEYS, target);
        if (!keys) keys = [ name ]
        else !keys.includes(name) && keys.push(name)
        Reflect.defineMetadata(CLASS_DECORATE_KEYS, keys, target)

        let list = Reflect.getMetadata(CUSTOM_VALIDATE, target, name)
        if (!list) list = [ { fn, message } ]
        else list.push({ fn, message })
        Reflect.defineMetadata(CUSTOM_VALIDATE, list, target, name)
    }
}

type ConstructorClass<T extends new(...args: any[]) => any> = T extends new(...args: infer P) => any ? P : never

export const createSafeClass = <T extends new(...args: any[]) => any>(Target: T) => {
    return (...arg: ConstructorClass<typeof Target>) => {
        return new Target(...arg)
    }
}