const constant = require("./constant");
// import { UsersStore } from '../store'
const error = require('../utils/snError');
import jwt_decode from 'jwt-decode'
// import jwt from 'jsonwebtoken'

export default async (ctx, next) => {//鉴权
    try {
        if(ctx.headers['authorization']){
            const token = ctx.headers['authorization']
            const userinfo = JSON.stringify(jwt_decode(token))
            console.log(JSON.parse(userinfo))
            const { principal:{username} } = JSON.parse(userinfo)
            if(userinfo&&username){
                // Object.assign(ctx.request.body,userinfo)
                // console.log(userinfo)
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

