/**
 * Created by root on 2017/06/22.
 */
import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic'
const etsDfxListSchema = new mongoose.Schema({
    paltform:String,
    dfx_type:Number,
    member_code:String,
    ip:String,
    versionFlag:Number,
    sign:String,
    member_name:String,
    event:Number,
    type:Number,
    login_name:Number,
    user_name:String,
    merchant_name:String,
    merchant_code:String,
    pagePath:String,
    fromPath:String,
    create_time: {type: Date, default: Date.now}//回复时间
})

etsDfxListSchema.plugin(mongoosastic,{
    hosts:[
        '192.168.20.160:9200'
    ]
})

export default (db = mongoose) => db.model('dfx_track_event', etsDfxListSchema, 'dfx_track_event');