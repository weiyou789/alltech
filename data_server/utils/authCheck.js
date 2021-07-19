const constant = require("./constant");
import { UsersStore } from '../store'
const error = require('../utils/snError');
// import jwt from 'jsonwebtoken'

export default async (ctx, next) => {//鉴权
    try {
        if(ctx.headers['token']){
            const token = ctx.headers['token']
            const UsersModel = new UsersStore()
            const userinfo = await UsersModel.findUser(token)
            if(userinfo){
                Object.assign(ctx.request.body,userinfo)
                return next()
            } else {
                ctx.response.body = constant.NO_AUTH;
            }
            //判断token是否过期，暂时不用
            /*jwt.verify(token, userinfo.password,(err, decode)=>{
                if (err) {
                    ctx.response.body = constant.RUNTIME_ERROR;
                } else {
                    ctx.response.body = Object.assign({result:userinfo}, constant.SUCCESS);
                    return next()
                }
            })*/
        }else{
            return ctx.body = constant.NO_AUTH;
        }
    } catch (err) {
        ctx.body = error('authCheck', err);
    }
}

