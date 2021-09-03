/**
 * Created by root on 2017/4/24.
 */
/**
 * @namespace API
 * @description 接口相关
 * */
const error = require('../utils/snError');
const constant = require('../utils/constant');
const schedule = require('node-schedule');
// const task = require("../utils/task");
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { EtsDfxStore } from '../store'
import redis from '../utils/redis'
import authCheck from '../utils/authCheck'

let rule = new schedule.RecurrenceRule();
rule.date = 1;
rule.hour = 10;
rule.minute = 0;
rule.second = 0;

const getEtsDfxAllList = async (ctx,next) => {
    try {
        const EtsModel = new EtsDfxStore()
        const list = await EtsModel.getEtsDfxAllListMtd()
        ctx.body = Object.assign({ result: list }, constant.SUCCESS)
        return next();
    }catch (err) {
        ctx.body = error('getEtsDfxAllList', err);
        return next();
    }
}

const getEtsDfxTimeList = async (ctx,next) => {
    try {
        const EtsModel = new EtsDfxStore()
        const { startTime,endTime } = ctx.query
        const list = await EtsModel.getEtsDfxTimeListMtd({startTime,endTime})
        ctx.body = Object.assign({ result: list.length }, constant.SUCCESS)
        return next();
    }catch (err) {
        ctx.body = error('getEtsDfxTimeList', err);
        return next();
    }
}

const getEtsDfxMemList = async (ctx,next) => {
    try {
        const { memberCode } = ctx.query
        if (!memberCode) {
            ctx.body = constant.PARAMS_ERR
            return next()
        }
        const EtsModel = new EtsDfxStore()
        const list = await EtsModel.getEtsDfxMemListMtd({memberCode})
        ctx.body = Object.assign({ result: list }, constant.SUCCESS)
        return next();
    }catch (err) {
        ctx.body = error('getEtsDfxMemList', err);
        return next();
    }
}

const getEtsDfxTimeLively = async (ctx,next) => {
    try {
        const { startTime,endTime } = ctx.query
        if (!startTime || !endTime) {
            ctx.body = constant.PARAMS_ERR
            return next()
        }
        const EtsModel = new EtsDfxStore()
        const listAll = await EtsModel.getEtsDfxTimeLivelyMtd({startTime,endTime})
        ctx.body = Object.assign({ result:{listAll:listAll.length}}, constant.SUCCESS)
        return next();
    }catch (err) {
        ctx.body = error('getEtsDfxTimeLively', err);
        return next();
    }
}


const getEtsEvenyDayLively = async (ctx,next) => {
    try {
        const { startTime,endTime,type } = ctx.query
        if (!startTime || !endTime||!type) {
            ctx.body = constant.PARAMS_ERR
            return next()
        }
        const EtsModel = new EtsDfxStore()
        let _type = type+'Day'
        let data = await redis.get(_type)
        let _data = JSON.parse(data)
        let last = _.last(_data)
        let listAll
        if(type==='dfx'){
            if(data){
                if(new Date(endTime).getTime()>new Date(last._id).getTime()){
                    listAll = await EtsModel.getEtsDfxEvenyDayLivelyMtd({startTime,endTime})
                } else {
                    listAll = _data.filter(item=>new Date(item._id).getTime()>=new Date(startTime).getTime()&&new Date(item._id).getTime()<=new Date(endTime).getTime())
                }
            } else {
                listAll = await EtsModel.getEtsDfxEvenyDayLivelyMtd({startTime,endTime})
                redis.set('dfxDay', JSON.stringify(listAll));
            }
            ctx.body = Object.assign({ result:listAll}, constant.SUCCESS)
        } else if(type==='min') {
            if(data){
                if(new Date(endTime).getTime()>new Date(last._id).getTime()){
                    listAll = await EtsModel.getEtsMinEvenyDayLivelyMtd({startTime,endTime})
                } else {
                    listAll = _data.filter(item=>new Date(item._id).getTime()>=new Date(startTime).getTime()&&new Date(item._id).getTime()<=new Date(endTime).getTime())
                }
            } else {
                listAll = await EtsModel.getEtsMinEvenyDayLivelyMtd({startTime,endTime})
                redis.set('minDay', JSON.stringify(listAll));
            }
            ctx.body = Object.assign({ result:listAll}, constant.SUCCESS)
        } else if(type==='all'){
            if(data){
                if(new Date(endTime).getTime()>new Date(last._id).getTime()){
                    let listAll1 = await EtsModel.getEtsDfxEvenyDayLivelyMtd({startTime,endTime})
                    let listAll2 = await EtsModel.getEtsMinEvenyDayLivelyMtd({startTime,endTime})
                    if(listAll2.length>0&&listAll1.length>0){
                        listAll = listAll1.map((item,index)=>{
                            let arr = item.member_list
                            listAll2.forEach((item1,index1)=>{
                                if(item._id.toString()===item1._id.toString()){
                                    let arr1 = item.member_list
                                    let arr2 = item1.member_list
                                    arr = Array.from(new Set(arr1.concat(arr2)))
                                }
                            })
                            return {
                                _id:item._id,
                                member_list:arr,
                                members:arr.length
                            }
                        })
                        redis.set('allDay', JSON.stringify(listAll));
                    }
                } else {
                    listAll = _data.filter(item=>new Date(item._id).getTime()>=new Date(startTime).getTime()&&new Date(item._id).getTime()<=new Date(endTime).getTime())
                }
            } else {
                let listAll1 = await EtsModel.getEtsDfxEvenyDayLivelyMtd({startTime,endTime})
                let listAll2 = await EtsModel.getEtsMinEvenyDayLivelyMtd({startTime,endTime})
                if(listAll2.length>0&&listAll1.length>0){
                    listAll = listAll1.map((item,index)=>{
                        let arr = item.member_list
                        listAll2.forEach((item1,index1)=>{
                            if(item._id.toString()===item1._id.toString()){
                                let arr1 = item.member_list
                                let arr2 = item1.member_list
                                arr = Array.from(new Set(arr1.concat(arr2)))
                            }
                        })
                        return {
                            _id:item._id,
                            member_list:arr,
                            members:arr.length
                        }
                    })
                    redis.set('allDay', JSON.stringify(listAll));
                }

            }
            ctx.body = Object.assign({ result:listAll}, constant.SUCCESS)
        }

        return next();
    }catch (err) {
        ctx.body = error('getEtsEvenyDayLively', err);
        return next();
    }
}


const getEtsLookProductNumber = async (ctx,next) => {
    try {
        const { startTime,endTime,type } = ctx.query
        if (!startTime || !endTime||!type) {
            ctx.body = constant.PARAMS_ERR
            return next()
        }
        const EtsModel = new EtsDfxStore()
        let data = await redis.get(type)//获取缓存数据
        let _data = JSON.parse(data)
        let last = _.last(_data)//获取缓存数据的最后一位
        let listAll = []
        if(type==='dfx'){
            listAll = await EtsModel.getEtsDfxLookProductNumberMtd({startTime,endTime})
            /*if(data){
                if(new Date(endTime).getTime()>new Date(last._id).getTime()){//如果当前传过来的日期大于缓存数据最后一位的日期，直接到库里获取
                    listAll = await EtsModel.getEtsDfxLookProductNumberMtd({startTime,endTime})
                } else {//否则从缓存数据里截取当前传过来的日期的数据
                    listAll = _data.filter(item=>new Date(item._id).getTime()>=new Date(startTime).getTime()&&new Date(item._id).getTime()<=new Date(endTime).getTime())
                }
            } else {//如果缓存里没有数据，直接到库里获取数组并且存入到缓存里
                listAll = await EtsModel.getEtsDfxLookProductNumberMtd({startTime,endTime})
                redis.set('dfx', JSON.stringify(listAll));
            }*/

        } else if(type==='min') {
            listAll = await EtsModel.getEtsMinLookProductNumberMtd({startTime,endTime})
            /*if(data){
                if(new Date(endTime).getTime()>new Date(last._id).getTime()){
                    listAll = await EtsModel.getEtsMinLookProductNumberMtd({startTime,endTime})
                } else {
                    listAll = _data.filter(item=>new Date(item._id).getTime()>=new Date(startTime).getTime()&&new Date(item._id).getTime()<=new Date(endTime).getTime())
                }

            } else {
                listAll = await EtsModel.getEtsMinLookProductNumberMtd({startTime,endTime})
                redis.set('min', JSON.stringify(listAll));
            }*/
        } else if(type==='all'){
            let listAll1 = await EtsModel.getEtsDfxLookProductNumberMtd({startTime,endTime})
            let listAll2 = await EtsModel.getEtsMinLookProductNumberMtd({startTime,endTime})
            if(listAll2.length>0&&listAll1.length>0){
                listAll = listAll1.map((item,index)=>{
                    let arr = item.spuCodes
                    listAll2.forEach((item1,index1)=>{
                        if(item._id.toString()===item1._id.toString()){
                            let arr1 = item.spuCodes
                            let arr2 = item1.spuCodes
                            arr = Array.from(new Set(arr1.concat(arr2)))
                        }
                    })
                    return {
                        _id:item._id,
                        spuCodes:arr,
                        lookNum:arr.length
                    }
                })
                redis.set('all', JSON.stringify(listAll));
            }
            /*if(data){
                if(new Date(endTime).getTime()>new Date(last._id).getTime()){
                    let listAll1 = await EtsModel.getEtsDfxLookProductNumberMtd({startTime,endTime})
                    let listAll2 = await EtsModel.getEtsMinLookProductNumberMtd({startTime,endTime})
                    if(listAll2.length>0&&listAll1.length>0){
                        listAll = listAll1.map((item,index)=>{
                            let arr = item.spuCodes
                            listAll2.forEach((item1,index1)=>{
                                if(item._id.toString()===item1._id.toString()){
                                    let arr1 = item.spuCodes
                                    let arr2 = item1.spuCodes
                                    arr = Array.from(new Set(arr1.concat(arr2)))
                                }
                            })
                            return {
                                _id:item._id,
                                spuCodes:arr,
                                lookNum:arr.length
                            }
                        })
                    }
                } else {
                    listAll = _data.filter(item=>new Date(item._id).getTime()>=new Date(startTime).getTime()&&new Date(item._id).getTime()<=new Date(endTime).getTime())
                }
            } else {
                let listAll1 = await EtsModel.getEtsDfxLookProductNumberMtd({startTime,endTime})
                let listAll2 = await EtsModel.getEtsMinLookProductNumberMtd({startTime,endTime})
                if(listAll2.length>0&&listAll1.length>0){
                    listAll = listAll1.map((item,index)=>{
                        let arr = item.spuCodes
                        listAll2.forEach((item1,index1)=>{
                            if(item._id.toString()===item1._id.toString()){
                                let arr1 = item.spuCodes
                                let arr2 = item1.spuCodes
                                arr = Array.from(new Set(arr1.concat(arr2)))
                            }
                        })
                        return {
                            _id:item._id,
                            spuCodes:arr,
                            lookNum:arr.length
                        }
                    })
                    redis.set('all', JSON.stringify(listAll));
                }
            }*/
        }
        ctx.body = Object.assign({ result:listAll}, constant.SUCCESS)
        return next();
    }catch (err) {
        ctx.body = error('getEtsLookProductNumber', err);
        return next();
    }
}


const getEtsAllPagePath = async (ctx,next) => {
    try {
        const EtsModel = new EtsDfxStore()
        const { startTime,endTime,pagePath } = ctx.query
        let _pagePath = decodeURIComponent(pagePath)
        let minPagePath = _pagePath.slice(1)
        const listDfx = await EtsModel.getEtsDfxPagePathMtd({startTime,endTime,pagePath:_pagePath})
        const listMin = await EtsModel.getEtsMinPagePathMtd({startTime,endTime,pagePath:minPagePath})
        const dfxPv = await EtsModel.getEtsDfxPvMtd({startTime,endTime,pagePath:_pagePath})
        const minPv = await EtsModel.getEtsMinPvMtd({startTime,endTime,pagePath:minPagePath})
        ctx.body = Object.assign({ result:{ dfxUv:listDfx.length,minUv:listMin.length,dfxPv,minPv }}, constant.SUCCESS)
        return next();
    }catch (err) {
        ctx.body = error('getEtsAllPagePath', err);
        return next();
    }
}


const getEtsGroupAll = async (ctx,next) => {
    try {
        const EtsModel = new EtsDfxStore()
        const { startTime,endTime,groupParticipationId } = ctx.query
        // let _pagePath = decodeURIComponent(groupParticipationId)
        // let minPagePath = _pagePath.slice(1)
        // const dfxUvList = await EtsModel.getEtsGroupUvMtd({startTime,endTime,groupParticipationId,source:1})
        // const minUvList = await EtsModel.getEtsGroupUvMtd({startTime,endTime,groupParticipationId,source:2})
        // const dfxPv = await EtsModel.getEtsGroupPvMtd({startTime,endTime,groupParticipationId,source:1})
        // const minPv = await EtsModel.getEtsGroupPvMtd({startTime,endTime,groupParticipationId,source:2})
        const uvList = await EtsModel.getEtsGroupUvListMtd({startTime,endTime,source:2})
        // ctx.body = Object.assign({ result:{ dfxUv:dfxUvList.length,minUv:minUvList.length,dfxPv,minPv,uvList }}, constant.SUCCESS)
        ctx.body = Object.assign({ result:{ uvList }}, constant.SUCCESS)
        return next();
    }catch (err) {
        ctx.body = error('getEtsGroupAll', err);
        return next();
    }
}

const getEtsAllTimeLively = async (ctx,next) => {
    try {
        const { startTime,endTime } = ctx.query
        if (!startTime || !endTime) {
            ctx.body = constant.PARAMS_ERR
            return next()
        }
        const EtsModel = new EtsDfxStore()
        const listDfx = await EtsModel.getEtsDfxTimeLivelyMtd({startTime,endTime})
        const listMin = await EtsModel.getEtsMinTimeLivelyMtd({startTime,endTime})
        let _listDfx = listDfx.map(item=>item._id)
        let _listMin = listMin.map(item=>item._id)
        let _listAll = _listDfx.concat(_listMin)
        let listAll = Array.from(new Set(_listAll));
        ctx.body = Object.assign({ result:{listDfx:listDfx.length,listMin:listMin.length,listAll:listAll.length,list:listAll}}, constant.SUCCESS)
        return next();
    }catch (err) {
        ctx.body = error('getEtsAllTimeLively', err);
        return next();
    }
}

const clearRedisCache = async (ctx,next) =>{//清除缓存数据
    try {
        const { types } = ctx.request.body
        console.log(types)
        for(let i=0;i<=types.length;i++){
            await redis.del(types[i])
        }
        ctx.body = Object.assign({ result:'清除成功'}, constant.SUCCESS)
        return next();

    }catch (err) {
        ctx.body = error('clearRedisCache', err);
        return next();
    }
}

const scheduleJobOpts = async (ctx,next) => {
    try {
        const { opt } = ctx.request.body
        if(opt.toString()==='start'){
            global.taskLisk.task1 = schedule.scheduleJob(rule, async () => {//定时任务更新数据每月1号10点自动获取数据缓存到redis里
                const EtsModel = new EtsDfxStore()
                let types = ["dfx","min","all","dfxDay","minDay","allDay"]
                let dfx = [],min=[],all=[],dfxDay=[],minDay=[],allDay=[],startTime = '2019-01-01 00:00:00',endTime = moment().format("YYYY-MM-DD HH:mm:ss")
                dfx = await EtsModel.getEtsDfxLookProductNumberMtd({startTime,endTime})
                min = await EtsModel.getEtsMinLookProductNumberMtd({startTime,endTime})
                dfxDay = await EtsModel.getEtsDfxEvenyDayLivelyMtd({startTime,endTime})
                minDay = await EtsModel.getEtsMinEvenyDayLivelyMtd({startTime,endTime})
                redis.set('dfx', JSON.stringify(dfx));
                redis.set('min', JSON.stringify(min));
                redis.set('dfxDay', JSON.stringify(dfxDay));
                redis.set('minDay', JSON.stringify(minDay));
                if(dfxDay.length>0&&minDay.length>0){
                    allDay = dfxDay.map((item,index)=>{
                        let arr = item.member_list
                        minDay.forEach((item1,index1)=>{
                            if(item._id.toString()===item1._id.toString()){
                                let arr1 = item.member_list
                                let arr2 = item1.member_list
                                arr = Array.from(new Set(arr1.concat(arr2)))
                            }
                        })
                        return {
                            _id:item._id,
                            member_list:arr,
                            members:arr.length
                        }
                    })
                    redis.set('allDay', JSON.stringify(allDay));
                }
                if(dfx.length>0&&min.length>0){
                    all = dfx.map((item,index)=>{
                        let arr = item.spuCodes
                        min.forEach((item1,index1)=>{
                            if(item._id.toString()===item1._id.toString()){
                                let arr1 = item.spuCodes
                                let arr2 = item1.spuCodes
                                arr = Array.from(new Set(arr1.concat(arr2)))
                            }
                        })
                        return {
                            _id:item._id,
                            spuCodes:arr,
                            lookNum:arr.length
                        }
                    })
                    redis.set('all', JSON.stringify(all));
                }
                console.info(endTime+'所有数据更新完成')
            })
        } else if(opt.toString()==='stop') {
            global.taskLisk.task1.cancel()//取消定时任务
        }
        ctx.body = Object.assign({ result:'成功'}, constant.SUCCESS)
        return next();

    }catch (err) {
        ctx.body = error('scheduleJobOpts', err);
        return next();
    }
}


module.exports = function (app) {
    app.get("/server/getEtsDfxAllList",authCheck, getEtsDfxAllList);
    app.get("/server/getEtsDfxTimeList",authCheck, getEtsDfxTimeList);
    app.get("/server/getEtsDfxMemList",authCheck, getEtsDfxMemList);
    app.get("/server/getEtsDfxTimeLively",authCheck, getEtsDfxTimeLively);
    app.get("/server/getEtsAllTimeLively",authCheck, getEtsAllTimeLively);
    app.get("/server/getEtsEvenyDayLively",authCheck, getEtsEvenyDayLively);
    app.get("/server/getEtsLookProductNumber",authCheck, getEtsLookProductNumber);
    app.get("/server/getEtsAllPagePath",authCheck, getEtsAllPagePath);
    app.get("/server/getEtsGroupAll",authCheck, getEtsGroupAll);
    app.post("/server/clearRedisCache",authCheck, clearRedisCache);
    app.post("/server/scheduleJobOpts",authCheck, scheduleJobOpts);
};