import { Controller, Post, Body } from "../lib/common";
import { NoticesService } from "./notices.service";

@Controller('notices')
export class NoticesController {

    constructor(public readonly noticesService: NoticesService) {}

    @Post('get')
    getNotices(@Body('type') type: string) {
        return this.noticesService.getNotices(type)
    }

    @Post('getlist')
    async getNoticesList(@Body() body) {
        return this.noticesService.getNoticesList(body)
    }
}