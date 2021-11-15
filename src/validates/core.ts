import { FactoryValid } from './utils';
/****** TODO 需要抽成工厂函数 */
/**
 * 验证参数是否为空
 * @param param0 对象合集
 * @returns 
 */
function IsNotEmpty(init) {
    const fn = v => {
        if (!v) return true;
    }
    return FactoryValid(init, fn)
}

/**
 * 验证字符串长度
 * @param param0 对象合集
 * @returns 
 */
function Length({ message, value }) {
    const fn = v => {
        if(v?.length !== value) return true;
    }
    return FactoryValid({ message, value }, fn)
}

/**
 * 验证数字最大值
 * @param param0 对象合集
 * @returns 
 */
function Max({ message, value }) {
    const fn = v => {
        if (value < v) return true;
    }

    return FactoryValid({ message, value }, fn)
}

/**
 * 验证数字最小值
 * @param param0 对像合集
 * @returns 
 */
function Min({ message, value }) {
    const fn = v => {
        if (value > v) return true;
    }

    return FactoryValid({ message, value }, fn)
}

export { IsNotEmpty, Length, Max, Min }