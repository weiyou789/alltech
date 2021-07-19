/**
 * Created by root on 2017/06/22.
 */
import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic'
const solveListSchema = new mongoose.Schema({
    iphoneNum:Number,//用户唯一标识
    username:String,//用户名
    solveId:String, // 回复ID
    solveCon:String,//回复内容
    created_time: {type: Date, default: Date.now}//回复时间
})

const questionListSchema = new mongoose.Schema({
    questionTitle:{
        type:String,
        es_type:'text',
        es_analyzer:'ik_max_word',
        es_search_analyzer:'ik_max_word',
        es_search_quote_analyzer:'ik_max_word'
    },
    questionCon:String,
    questionId:String,
    questionSolve:[solveListSchema],
    iphoneNum:Number,
    created_time: {type: Date, default: Date.now}//创建时间
})
questionListSchema.plugin(mongoosastic,{
    hosts:[
        '192.168.20.160:9200'
    ]
})
// 创建Model并默认导出
export default (db = mongoose) => db.model('questionList', questionListSchema);
