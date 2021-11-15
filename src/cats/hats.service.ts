import { Injectable } from "../lib/common";
import { HttpService } from '../lib/http.axios.service';
import { AxiosResponse } from "axios";

@Injectable
export class HatsService {
    constructor(private readonly httpService: HttpService) {}
    hatsName: string = 'hats-test'
    async getBatName(type?: number): Promise<AxiosResponse<string>> {
        const res: AxiosResponse<string> = await this.httpService.axios.get('https://www.hualazimi.xyz')
        return res
    }
}