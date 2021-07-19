/**
 * Created by root on 2017/4/24.
 */
/**
 * @namespace API
 * @description 接口相关
 * */
const error = require('../utils/snError');
const constant = require('../utils/constant');
import { QuestionStore } from '../elsStore'

const elsAddData = async (ctx, next) => {
    try{
        // const { data } = ctx.request.body
        const _date = new Date()
        let question = new QuestionStore()
        await question.createIndex()
        await question.addData(Object.assign(ctx.request.body,{
            update_date:_date
        }))
        ctx.body = Object.assign({}, constant.SUCCESS);
        return next();
    }catch (err) {
        ctx.body = error('elsAddData', err);
        return next();
    }
}

const elsSearchData = async (ctx, next) => {
    try{
        const { value } = ctx.query
        /*const ik_res = await client.indices.analyze({
            body:{
                "analyzer":'ik_smart',
                "text":[value]
            }
        });
        console.log(ik_res)*/
        let question = new QuestionStore()
        await question.createIndex()
        const res = await question.questionSearch(value||'')
        const { hits:{ hits } } = res
        ctx.body = Object.assign(hits, constant.SUCCESS);
    }catch (err) {
        ctx.body = error('elsSearchData', err);
        return next();
    }
}

module.exports = function (app) {
    /*app.post("/server/elsAddData", elsAddData);
    app.get("/server/elsSearchData", elsSearchData);*/
};
