/**
 * Created by root on 2017/06/22.
 */
import mongoose from 'mongoose'
const usersSchema = new mongoose.Schema({
    username:String,//用户名
    iphoneNum:{type:Number,unique:true},//用户id
    password:String,//用户密码
    created_time: {type: Date, default: Date.now},//创建时间
    token:String
})

export default (db = mongoose) => db.model('users', usersSchema);