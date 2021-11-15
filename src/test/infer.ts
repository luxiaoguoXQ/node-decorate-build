/*
 * @Author: HUALAZIMI
 * @Date: 2021-10-29 11:19:58
 * @LastEditTime: 2021-11-09 14:10:58
 */
// infer => 动态类型断言

// type ConstructorP<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never

class User {
    constructor(
        public name: string,
        public age: number
    ){}
}

const FuncUser = (a: number, b: number): string => '123'

type Params = ConstructorP<typeof User>

const list: Params = ['1111', 18]

type Instance<T extends (...args: any) => any> = T extends (...args: infer E) => infer P ? P & E : never

type Inst = Instance<typeof FuncUser>

type ABS<P> = P extends Array<infer K> ? K : never
// type SBA<U> = (U extends any ? (k: U) => void : never) extends (k: infer M) => void ? M : never
// type SBA<U> = (U extends any ? (k: U) => void : never) extends (...args: infer M) => void ? M : never
type CCC<T> = (T extends any ? T : never) extends infer P ? P : never
// type CCC = keyof Tup

type Tup = [a: string, b: number]
const tup: Tup = ['123', 123]

type HHH = ABS<typeof tup>
type XXX = CCC<User | Status>

// 联合类型转交叉类型

// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

// type Cross = UnionToIntersection<string | number>

// const a: Cross = 1;
interface User {
    name: string;
    age: number;
}

interface Status {
    name: string;
    status: number;
}
// type BBB<U> = (U extends any ? (k: U) => void : never)
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
type AAA = UnionToIntersection<User | Status>

// type Bar<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void } ? U : never;
// type T20 = Bar<{ a: (x: string) => void, b: (x: string) => void }>;
// type T21 = Bar<{ a: (x: string) => void, b: (x: number) => void }>; 

type Fnnn<U> = U extends (...args: any) => infer P ? P : never 
type Fn = () => string
type FF = Fnnn<Fn>

class TestAB {
    constructor(public name: string, public age: number) {}
}

type ConstructorP<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never
const createInstance = <T extends new(...args: Array<any>) => any>(args: T) => {
    return (...params: ConstructorP<typeof args>) => {
        return new args(...params);
    }
}

const create = createInstance(TestAB)('12', 28)

type StringList<T extends Array<string>> = T

// const l: StringList<Array<number>> = ['1']

// type TestPartial = Partial<Test>
// type TestRequie = Required<Test>

type TestA = {
    name: string;
    age: number;
    value: string;
}

type TestB = {
    name: string;
    age: number;
    time: Date;
}

type TestExtract = Extract<TestA, TestB>
type TestExlcude = Exclude<TestA, TestB>
type TestOmit = Omit<TestA, 'age'>

export { }
