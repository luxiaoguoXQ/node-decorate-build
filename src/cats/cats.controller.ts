import { Controller, Middleware, Get, Post, Query, Body, ValidateParams, Pipe, Custom } from "../lib/common";
import { Headers, Req } from "../lib/custom_decorator";
// import { format } from "../lib/pipe";
import { CatsService } from "./cats.service";
import { BatsService } from "./bats.service";
import { HatsService } from './hats.service';
import { ValidatePassengerBaseInfo, ValidateBaseInfo, ValidateMailBaseInfo } from "../validates/passenger_valid";
// import * as async_hooks from 'async_hooks';
// import { getContext } from "../context/glob";
import * as fs from 'fs';
import * as formidableMiddleware from 'express-formidable';
import * as path from 'path';

import { auth, inspect } from '../middleware/auth';
// const session = getContext();

@Controller('cats')
export class CatsController {
    constructor(
        public readonly catsService: CatsService,
        public readonly batsService: BatsService,
        public readonly hatsService: HatsService
    ) {}

    @Get('findall')
    findAll(): string {
        return 'find all'
    }

    @Get('findone')
    findOne(@Headers() header): string {
        console.log('header', header)
        return 'find one'
    }

    @Post('create')
    @Middleware(auth)
    @ValidateParams()
    async create(@Body() query, @Query('name') name, @Body('mail') mail: ValidateMailBaseInfo): Promise<string> {
        console.log('query, name, age', query, name, mail)
        return this.catsService.getCatName()
    }

    /**
     * 待处理装饰器顺序(按照从里到外的顺序执行中间件, 等待改写mapRoute方法)
     * @param host 
     * @param base 
     * @param type 
     * @param obj 
     * @returns 
     */
    @Post('test')
    @Middleware(inspect)
    @Middleware(auth)
    @ValidateParams()
    // @Pipe(format)
    async gettestvalue(
        @Headers() header: any,
        @Body('base') base: ValidateBaseInfo,
        @Query('type') type,
        @Body('obj') obj: ValidatePassengerBaseInfo,
        @Headers('trace-id') traceId: string
    ): Promise<ValidatePassengerBaseInfo & ValidateBaseInfo> {
        // const { req } = session.get('context');
        // console.log('host', host)
        console.log('host, traceId', header?.host, traceId)
        const result = await this.hatsService.getBatName(type)
        return Object.assign(obj, base)
    }

    @Post('axiostest')
    async gethatsvalue(@Body('type') type) {
        console.log('type', type)
        const result = await this.hatsService.getBatName(type)
        return result 
    }

    @Post('upload')
    @Middleware(formidableMiddleware())
    getformvalue(@Req() req, @Body('name') name, @Body() body) {
        // const { req } = session.get('context');
        const file = req.files.file
        const www = fs.createWriteStream(path.resolve(__dirname, `../public/images/${+new Date()}-${file.name}`))
        const rrr = fs.createReadStream(file.path)
        rrr.pipe(www)
        return { name }
    }

}