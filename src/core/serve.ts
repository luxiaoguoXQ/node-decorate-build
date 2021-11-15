/*
 * @Author: your name
 * @Date: 2021-09-13 16:37:43
 * @LastEditTime: 2021-11-15 13:50:23
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /Reflect-meta/learning/src/core/serve.ts
 */
import * as express from 'express';

import { json, urlencoded } from 'body-parser';

import * as cors from 'cors';

import { getContext } from '../context/glob';

import { HandleParams } from '../middleware/handle';

import * as client from 'prom-client';

class App {
    public app: express.Application;
    // private router = express.Router();
    private configs;
    private session = getContext();

    constructor(configs: Array<any>) {
        this.app = express();
        this.configs = configs;
        this.config();
        /** prometheus --config.file=/usr/local/etc/prometheus.yml */
        this.handlePromMetrics();
        // 生成路由
        this.getRoutes(this.configs);
        // 启动服务
        this.init();
    }

    /**
     * 中间件配置(跨域、contentType类型解析、CLS支持)
     */
    private config() {
        //开启 cors
        this.app.use(cors())
        //支持  application/json类型 发送数据
        this.app.use(json());
        //支持 application/x-www-form-urlencoded 发送数据
        this.app.use(urlencoded({extended:false}))

        // 支持CLS
        this.app.use((req, res, next) => {
            this.session.run(() => {
                this.session.set('context', { req, res })
                next()
            })
        })

        // 测试(待配置、待处理)
        // this.app.get("/metrics", (req, res) => {
        //     res.end(client.register.metrics());
        // });
    }

    /**
     * 性能指标
     */
    private handlePromMetrics() {
        const defaultLabels = { serviceName: 'prometheus' };
        client.register.setDefaultLabels(defaultLabels);

        // 计数器
        const counter = new client.Counter({
            name: 'counter',
            help: '请求次数'
        })

        // 仪表值(与计数器类型，但是值可以减少)
        const gauge = new client.Gauge({
            name: 'gauge',
            help: '仪表值'
        })

        // 柱状图
        const histogram = new client.Histogram({
            name: 'histogram',
            help: '柱状图',
            buckets: [0.1, 5, 15, 50, 100, 500]
        })

        // 汇总
        const summary = new client.Summary({
            name: 'summary',
            help: '汇总'
        })


        this.app.get('/', async (req, res) => {
            counter.inc()

            // 网络请求时间
            const endForGauge = gauge.startTimer()

            // histogram计算请求持续时间
            const endForHistogram = histogram.startTimer()

            // 汇总
            const endForSummary = summary.startTimer();

            const millisec = Math.ceil(Math.random() * 3 * 1000); // 生成 1-3000 秒之间的数字
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(`延时 ${millisec / 1000} 秒`);
                    resolve(1);
                }, millisec);
            });

            endForGauge();
            const seconds = endForHistogram();
            endForSummary();
            console.log(`请求持续 ${seconds} 秒`);

            res.json("Hello World!");
        })

        let scrapeTimes = 0;
        this.app.get('/metrics', async (req, res) => {
            console.log(`====== 第 ${scrapeTimes++} 次抓取数据 ======\n`);
            // console.log(await client.register.metrics());
            const value = await client.register.metrics()
            res.end(value);
        });
    }

    /**
     * 生成路由
     * @param configs 解析出来的路由配置
     */
    private getRoutes(configs) {
        for (const config of configs) {
            const { controller, instance } = config
            for (const v of controller.routes) {
                const { route, method, fn, methodName, middlewares, pipefunction } = v;
                const smallMethod = method.toLocaleLowerCase();
                const middles = middlewares ? middlewares : [];
                middles.unshift(HandleParams(v));


                this.app[smallMethod](route, ...middles, (req, res) => {

                    /** 执行原方法 */
                    const middle_temp = instance?.[methodName].apply(instance, req.newlists);
                    /** 执行原方法end */

                    const isPromise = typeof middle_temp === 'object' && middle_temp.then && middle_temp.catch;
                    const sendSuccessData = data => { return {success: true, code: 200, message: '请求成功', data}};
                    const sendErrData = data => { return {success: false, code: 500, message: '请求异常', data} }

                    /** 如果是个promise, 等待结果返回 */
                    isPromise && (middle_temp.then(data => res.send(sendSuccessData(data))).catch(err => res.send(sendErrData(err))))
                    !isPromise && res.send(sendSuccessData(middle_temp))
                    /** 如果是个promise, 等待结果返回end */
                })    
            }
        }    
    }
    
    /**
     * 启动服务
     */
    private init() {
        this.app.listen(4000);
        console.log(`server running at http://127.0.0.1:4000`);
    }

}

export default App