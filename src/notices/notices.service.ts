import { Injectable } from "../lib/common";

@Injectable
export class NoticesService {
    getNotices(type: string) {
        if (+type === 1) {
            return `这是公告${type}: 测试`
        } else {
            return `测试: 这是公告${type}`
        }
    }

    async getNoticesList(body) {
        return `我是一只小小小小鸟: ${body?.name}`
    }
}