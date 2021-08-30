require('babel-register')
require('babel-polyfill')

const Koa = require('koa');
const fs = require('fs');
const app = new Koa();
const Router = require('koa-router');
const session = require('koa-session');
const router = new Router();
const bodyParser = require("co-body");
const logger = require("./utils/logger").getLogger(__filename.split("/").pop());
const moment = require('moment');
const uuidV1 = require('uuid/v1');
const pkg = require('./package.json')
const toBase64 = require('./utils/toBase64');
const interfaces = require('os').networkInterfaces();
const isLocal = process.env.LOCAL !== undefined;
const isProd = process.env.NODE_ENV === 'PRD';
const isPre = process.env.NODE_ENV === 'PRE';
const isDev = process.env.NODE_ENV === 'DEV';
const cookieParser = require('koa-cookie');
const cors = require('koa2-cors');
const koabody = require('koa-body');
const authCheck = require("./utils/authCheck");
// import authCheck from './utils/authCheck'

//全局变量用来保存定时任务
((global)=>{
    global.taskLisk = {

    }
})(global);
// 扫描Action

((path) => {
    fs.readdir(path, (err, files) => {
        if (!err) {
            files.forEach((item) => {
                let tmpPath = path + '/' + item;
                fs.stat(tmpPath, (err1, stats) => {
                    if (!err1 && !stats.isDirectory()) {
                        logger.info('load action :' + tmpPath);
                        require(tmpPath)(router)
                    }
                })
            });
        }
    });
})('./actions');

const IPv4 = ((interfaces) => {
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
})(interfaces);

app.use(koabody({multipart: true,formidable: {
        maxFileSize: 200*1024*1024
    }})).use(cors()).use(async (ctx, next) => {//日志
    let requestStartTime = new Date();
    if(ctx.method==='GET'){
        logger.info(`${ctx.method}\t${ctx.url}\t${JSON.stringify(ctx.query)}`);
        await next();
    }else if(ctx.method==='POST'){
        logger.info(`${ctx.method}\t${ctx.url}\t${JSON.stringify(ctx.request.body)}`);
        await next();
    }
    // logger.info(`use: ${ new Date() - requestStartTime }ms\treturn: ${JSON.stringify(ctx.response.body)}`);
}).use(router.routes()).use(router.allowedMethods()).on('error', app.onerror);
app.listen(pkg.port,()=>{
    logger.info(`${pkg.name} listen at ${IPv4}:${pkg.port} in ${process.env.NODE_ENV} , pid is ${process.pid}`)
});

module.exports = {
    pkg,
    IPv4,
    uuidV1
}
