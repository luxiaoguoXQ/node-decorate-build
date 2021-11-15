import { IsNotEmpty, Length, Max, Min } from './core';
/**
 * 测试案例
 */
export class ValidatePassengerBaseInfo {
    @Length({ message: '长度必须为18位', value: 18 })
    certno: string;

    @IsNotEmpty({ message: '姓名不能为空' })
    name: string;
}

/**
 * 测试案例二
 */
export class ValidateBaseInfo {
    @Min({ message: '年龄不能小于18岁', value: 17 })
    @Max({ message: '年龄不能大于30岁', value: 29 })
    @IsNotEmpty({ message: '年龄不能为空' })
    age: number;
}

/**
 * 测试案例三
 */
export class ValidateMailBaseInfo {
    @IsNotEmpty({ message: '地址不能为空' })
    address: string;
    @IsNotEmpty({ message: '联系人不能为空' })
    name: string;
    @Length({ message: '长度必须为11位', value: 11 })
    @IsNotEmpty({ message: '电话不能为空' })
    phone: string;
}