import { Injectable } from "./common";
import axios from "axios";
import { LoggerService } from "./logger.service";

@Injectable
export class HttpService {
    public axios;
    constructor(public loggerService: LoggerService) {
        this.axios = axios;
        const logger = loggerService.initHttpLogger(`api`)
        this.axios.interceptors.request.use(config => {
            logger.info(`[request:success]`, config)
            return config;
        }, error => {
            logger.error(`[request:error]`, error)
            Promise.reject(error)
        });

        this.axios.interceptors.response.use(res => {
            logger.info(`[response:success]`, res?.data)
            return res?.data
        }, error => {
            logger.error(`[response:error]`, error)
            Promise.reject(error)
        })
    }
    // public axios = axios
}