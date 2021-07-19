/**
 * Created by root on 2017/4/24.
 */
/**
 * @namespace API
 * @description 接口相关
 * */
const error = require('../utils/snError')
const constant = require('../utils/constant')
import { QuestionListStore } from '../store'
import authCheck from '../utils/authCheck'
import uuid from 'node-uuid'

const searchQuestion = async (ctx,next) => {
    const questionListStore = new QuestionListStore()
    questionListStore.getQuestionList('测试')
    ctx.body = Object.assign({ result: 'ok' }, constant.SUCCESS)
}

const getAllQuestionList = async (ctx,next) => {//获取所有问题列表
    try{
        const size = parseInt(ctx.query.size) > 0 ? parseInt(ctx.query.size) : 10
        const start = ((parseInt(ctx.query.page) >= 1 ? parseInt(ctx.query.page) : 1) - 1) * size
        const questionListStore = new QuestionListStore()
        const list = await questionListStore.getAllQuestionList(size,start)
        ctx.body = Object.assign({ result: list }, constant.SUCCESS)
        return next()
    }catch (err) {
        ctx.body = error('getAllQuestionList', err)
        return next()
    }
}

const postQuestion = async (ctx,next) => {//提交问题
    try{
        const { questionTitle,questionCon,iphoneNum } = ctx.request.body
        const questionId = uuid.v1()
        const questionListStore = new QuestionListStore()
        const res = await questionListStore.saveQuestion({questionTitle,questionCon,iphoneNum,questionId})
        if(res){
            ctx.body = Object.assign({ result: 'ok' }, constant.SUCCESS)
        } else {
            ctx.body = constant.RUNTIME_ERROR
        }
        return next()
    }catch (err) {
        ctx.body = error('postQuestion', err)
        return next();
    }
}

const postSolveQuestion = async (ctx,next) => {// 回答问题
    try{
        let { questionId, questionSolve: {iphoneNum, username, solveCon, solveId} } = ctx.request.body

        // 参数错误，直接抛错退出
        if (!questionId || !iphoneNum || !username || !solveCon) {
            ctx.body = constant.PARAMS_ERR
            return next()
        }

        solveId = solveId || uuid.v1() // 如果回复id不存就创建一个
        const questionListStore = new QuestionListStore()
        const res = await questionListStore.solveQuestion(questionId, {...questionSolve, solveId})
        if(res){
            ctx.body = Object.assign({ result: 'ok' }, constant.SUCCESS)
        } else {
            ctx.body = constant.RUNTIME_ERROR
        }
        return next()
    }catch (err) {
        ctx.body = error('postSolveQuestion', err)
        return next()
    }
}


module.exports = function (app) {
    app.get("/server/searchQuestion", searchQuestion)
    app.get("/server/getAllQuestionList", getAllQuestionList)
    app.post("/server/postQuestion",authCheck, postQuestion)
    app.post("/server/postSolveQuestion",authCheck, postSolveQuestion)
};
