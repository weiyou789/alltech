/**
 * Created by root on 2017/4/24.
 */
/**
 * @namespace API
 * @description 接口相关
 * */
const error = require('../utils/snError');
const constant = require('../utils/constant');
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import { UsersStore } from '../store'


const register = async (ctx,next) => {//注册接口
    try {
        const { username,password,iphoneNum } = ctx.request.body
        const UsersModel = new UsersStore()
        await UsersModel.saveUser({username,password,iphoneNum})
        ctx.body = Object.assign({ result: 'ok' }, constant.SUCCESS);
        return next();
    }catch (err) {
        ctx.body = error('register', err);
        return next();
    }
}

const login = async (ctx,next) => {//登陆接口
    try{
        const { iphoneNum,password } = ctx.request.body
        const UsersModel = new UsersStore()
        const userinfo = await UsersModel.loginUser(iphoneNum,password)
        if(userinfo){
            const token = jwt.sign({ iphoneNum }, password, {
                expiresIn: 600*600
            })
            await UsersModel.updateToken(iphoneNum,token)
            ctx.body = Object.assign({ result: Object.assign(userinfo,{token}) }, constant.SUCCESS);
        } else {
            ctx.body = constant.NO_USER_PASS;
        }
        return next();
    }catch (err) {
        ctx.body = error('login', err);
        return next();
    }
}

module.exports = function (app) {
    app.post("/server/register", register);
    app.post("/server/login", login);
};