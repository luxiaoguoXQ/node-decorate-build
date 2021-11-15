
import { HANDLECONFIGS as configs } from "./config/register.config";


/* 假设引入express start */
import App from './core/serve';

import { createSafeClass } from "./validates/utils";

process.on('uncaughtException', err => {
    console.error(err)
})

process.on('unhandledRejection', err => {
    console.error(err)
})

createSafeClass(App)(configs);





