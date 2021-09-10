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
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { OrderStore } from '../store'
import redis from '../utils/redis'
import authCheck from '../utils/authCheck'

const getOrderList = async (ctx,next) => {
    try {
        const OrderModel = new OrderStore()
        const list = await OrderModel.getOrderData()
        // OrderModel.getOrderData()
        ctx.body = Object.assign({ result: list }, constant.SUCCESS)
        return next();
    }catch (err) {
        ctx.body = error('getOrderList', err);
        return next();
    }
}

const getOrderRepBuyRateAct = async (ctx,next) => {
    const { startMonth } = ctx.query
    if (!startMonth) {
        ctx.body = constant.PARAMS_ERR
        return next()
    }
    try {
        const OrderModel = new OrderStore()
        // const nextStartMonth= moment(startMonth).startOf('month').subtract('month', +1).format('YYYY-MM');
        const list1 = await OrderModel.getOrderRepBuyMtd({startMonth})
        const list2 = await OrderModel.getMonthOrderBuyMtd({startMonth})
        const list3 = await OrderModel.getBusMemListMtd()
        let list_bus_num1 = 0;
        let list_bus_num2 = 0;
        let _list3 = list3.map(item=>item.company_code)
        list1.forEach((item,index)=>{
            if(_list3.includes(item.member_code)){
                list_bus_num1++
            }
        })
        list2.forEach((item,index)=>{
            if(_list3.includes(item.member_code)){
                list_bus_num2++
            }
        })
        let next_month_rep_buy_rate = Number(parseInt(list1.length)/parseInt(list2.length) * 100).toFixed(2);
        let next_month_rep_buy_rate_bus = Number(parseInt(list_bus_num1)/parseInt(list_bus_num2) * 100).toFixed(2);
        next_month_rep_buy_rate += "%";
        next_month_rep_buy_rate_bus += "%";
        ctx.body = Object.assign({
            result: {
                rate:next_month_rep_buy_rate,
                rate_bus:next_month_rep_buy_rate_bus,
                list1:list1.length,
                list1_bus:list_bus_num1,
                list2:list2.length,
                list2_bus:list_bus_num2
            } }, constant.SUCCESS)
        return next();
    } catch (err) {
        ctx.body = error('getOrderRepBuyRateAct', err);
        return next();
    }
}

const getOrderEveryRepBuyRateAct = async (ctx,next) => {
    const { startMonth } = ctx.query
    if (!startMonth) {
        ctx.body = constant.PARAMS_ERR
        return next()
    }
    try {
        const OrderModel = new OrderStore()
        const list1 = await OrderModel.getOrderEveryRepBuyMtd({startMonth})
        const list2 = await OrderModel.getMonthOrderBuyMtd({startMonth})
        const list3 = await OrderModel.getBusMemListMtd()
        let list_bus_num1 = 0;
        let list_bus_num2 = 0;
        let _list3 = list3.map(item=>item.company_code)
        list1.forEach((item,index)=>{
            if(_list3.includes(item.member_code)){
                list_bus_num1++
            }
        })
        list2.forEach((item,index)=>{
            if(_list3.includes(item.member_code)){
                list_bus_num2++
            }
        })
        let month_rep_buy_rate = Number(parseInt(list1.length)/parseInt(list2.length) * 100).toFixed(2);
        let month_rep_buy_rate_bus = Number(parseInt(list_bus_num1)/parseInt(list_bus_num2) * 100).toFixed(2);
        month_rep_buy_rate += "%";
        month_rep_buy_rate_bus += "%";
        ctx.body = Object.assign({
            result: {
                rate:month_rep_buy_rate,
                rate_bus:month_rep_buy_rate_bus,
                list1:list1.length,
                list1_bus:list_bus_num1,
                list2:list2.length,
                list2_bus:list_bus_num2
            } }, constant.SUCCESS)
        return next();
    } catch (err) {
        ctx.body = error('getOrderEveryRepBuyRateAct', err);
        return next();
    }
}

const getEveryMonthRepBuyAct = async (ctx,next) => {
    try {
        const OrderModel = new OrderStore()
        const list = await OrderModel.getEveryMonthRepBuyMtd()
        ctx.body = Object.assign({ result: list }, constant.SUCCESS)
        return next();
    }catch (err) {
        ctx.body = error('getEveryMonthRepBuyAct', err);
        return next();
    }
}


const getOrderGroupEveryRepBuyMtd = async (ctx,next) => {
    try {
        const { startMonth,endMonth } = ctx.query
        const OrderModel = new OrderStore()
        const list1 = await OrderModel.getOrderGroupEveryRepBuyMtd({startMonth,endMonth})
        const list3 = await OrderModel.getBusMemListMtd()
        let _list3 = list3.map(item=>item.company_code)
        let _list1 = list1.map((item,index)=>{
            let m = JSON.parse(item.m)
            let dm = Array.from(new Set(JSON.parse(item.m)))
            let rm = []
            let dm_bus = 0;
            let rm_bus = 0;
            let tempArr = [];

            m.forEach(item=>{
                if(tempArr.includes(item)&&!rm.includes(item)){
                    rm.push(item);
                } else {
                    tempArr.push(item);
                }
            })

            /*for (let i = 0; i < dm.length; i++) {
                let v = dm[i]
                let p = 0
                for (let j = 0; j < m.length; j++) {
                    if (m[j] === v) {
                        p++
                    }
                    if (p > 1 && rm.indexOf(v) === -1) {
                        rm.push(v)
                        break
                    }
                }
            }*/

            dm.forEach((item,index)=>{
                if(_list3.includes(item)){
                    dm_bus++
                }
            })
            rm.forEach((item,index)=>{
                if(_list3.includes(item)){
                    rm_bus++
                }
            })
            let month_rep_buy_rate = Number(parseInt(rm.length)/parseInt(dm.length) * 100).toFixed(2);
            let month_rep_buy_rate_bus = Number(parseInt(rm_bus)/parseInt(dm_bus) * 100).toFixed(2);
            month_rep_buy_rate += "%";
            month_rep_buy_rate_bus += "%";
            return {
                rate:month_rep_buy_rate,
                rate_bus:month_rep_buy_rate_bus,
                dm_bus,
                rm_bus,
                dm:item.c,
                rm:rm.length,
                d:item.d
            }
        })
        ctx.body = Object.assign({ result: _list1 }, constant.SUCCESS)
        return next();
    }catch (err) {
        ctx.body = error('getOrderGroupEveryRepBuyAct', err);
        return next();
    }
}



module.exports = function (app) {
    // app.get("/server/getOrderList", getOrderList);
    app.get("/server/getOrderRepBuyRateAct",authCheck, getOrderRepBuyRateAct);
    app.get("/server/getOrderEveryRepBuyRateAct",authCheck, getOrderEveryRepBuyRateAct);
    app.get("/server/getEveryMonthRepBuyAct",authCheck, getEveryMonthRepBuyAct);
    app.get("/server/getOrderGroupEveryRepBuyAct",authCheck, getOrderGroupEveryRepBuyMtd);
};