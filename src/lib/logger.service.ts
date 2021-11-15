import { Injectable } from "./common";
import * as logger from 'log4js';

@Injectable
export class LoggerService {
    initHttpLogger(logName) {
        // console.log(`${__dirname}`, `${__filename}`)
        logger.configure({
            appenders: {
                [logName]: {
                    type: 'file',
                    filename: `/tmp/logs/${logName}.log`
                }
            },
            categories: {
                default: {
                    appenders: [`${logName}`],
                    level: 'all'
                }
            }
        })

        return logger.getLogger(logName)
    }
}