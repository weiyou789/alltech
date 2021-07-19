import MySqlStore from "./MySqlStore";
import moment from 'moment';
const config = require('../config');

function orderRepBuyRateSql(startTime, endTime) {
    return 'SELECT DISTINCT member_code FROM t_child_order WHERE child_order_status in (20,30,40,60,70)'+
        'AND merchant_code = "1ed0528595197975fa72f5ec8f9e0c62"'+
        `AND pay_time BETWEEN '${startTime}' AND '${endTime}'`
}

function orderEveryRepBuy(startTime, endTime) {
    return 'SELECT member_code FROM t_child_order WHERE child_order_status in (20,30,40,60,70)'+
        'AND merchant_code = "1ed0528595197975fa72f5ec8f9e0c62"'+
        `AND pay_time BETWEEN '${startTime}' AND '${endTime}'`+
        'GROUP BY member_code HAVING count( member_code ) > 1'
}

function orderGroupEveryRepBuy(startMonth, endMonth,rep) {
    return 'SELECT JSON_ARRAYAGG( member_code ) AS m,'+
        'count(DISTINCT member_code) AS c,'+
        'DATE_FORMAT( pay_time, "%Y-%m" ) AS d FROM t_child_order WHERE DATE_FORMAT( pay_time, "%Y-%m")'+
        `BETWEEN '${startMonth}' AND '${endMonth}'`+
        'AND child_order_status in (20,30,40,60,70)'+
        'AND merchant_code = "1ed0528595197975fa72f5ec8f9e0c62"'+
        'GROUP BY DATE_FORMAT( pay_time, "%Y-%m" )'
}

export default class OrderStore {
    constructor() {
        // super();
        const { orderDB,paymentDB } = config
        this.order = new MySqlStore(orderDB) //获取order数据库实例
        this.payment = new MySqlStore(paymentDB) //获取payment数据库实例
    }

    getOrderData(query){
        return new Promise((resolve,reject)=>{
            this.payment.query('select * from t_authentication_info limit 3, 7',(err,res,fields)=>{
                if (err) {
                    reject(err);
                }
                resolve(res,fields);
            })
        })

    }

    getBusMemListMtd(){//获取所有企业会员company_code
        return new Promise((resolve,reject)=>{
            this.payment.query('SELECT company_code FROM t_authentication_info WHERE user_type = 12',(err,res,fields)=>{
                if (err) {
                    reject(err);
                }
                let _res = JSON.stringify(res)
                resolve(JSON.parse(_res),fields);
            })
        })
    }

    getOrderEveryRepBuyMtd(query){
        const { startMonth } = query
        const _startMonth = moment(startMonth).format('YYYY-MM-DD HH:mm:ss')
        const startTime = moment(_startMonth).startOf('month').format('YYYY-MM-DD HH:mm:ss')
        const endTime = moment(_startMonth).endOf('month').format('YYYY-MM-DD HH:mm:ss')
        // const sql = `SELECT count(*) as c FROM(${orderEveryRepBuy(startTime,endTime)}) t2`;
        return new Promise((resolve,reject)=>{
            this.order.query(orderEveryRepBuy(startTime,endTime),(err,res,fields)=>{
                if (err) {
                    reject(err);
                }
                let _res = JSON.stringify(res)
                resolve(JSON.parse(_res),fields);
            })
        })
    }

    getOrderRepBuyMtd(query){
        const { startMonth } = query
        const _startMonth = moment(startMonth).format('YYYY-MM-DD HH:mm:ss')
        const startTime = moment(_startMonth).startOf('month').format('YYYY-MM-DD HH:mm:ss')
        const endTime = moment(_startMonth).endOf('month').format('YYYY-MM-DD HH:mm:ss')
        const nextStartTime= moment(_startMonth).startOf('month').subtract('month', -1).format('YYYY-MM-DD HH:mm:ss'); //下个月初
        const nextEndTime= moment(_startMonth).endOf('month').subtract('month', -1).endOf('month').format('YYYY-MM-DD HH:mm:ss'); //下个月末
        console.log(1111, nextStartTime,nextEndTime)
        // const sql = `SELECT count(*) as c FROM(${orderRepBuyRateSql(startTime,endTime)} AND member_code in (${orderRepBuyRateSql(nextStartTime,nextEndTime)})) t2`;
        const sql = `${orderRepBuyRateSql(startTime,endTime)} AND member_code in (${orderRepBuyRateSql(nextStartTime,nextEndTime)})`;
        return new Promise((resolve,reject)=>{
            this.order.query(sql,(err,res,fields)=>{
                if (err) {
                    reject(err);
                }
                let _res = JSON.stringify(res)
                resolve(JSON.parse(_res),fields);
            })
        })
    }

    getMonthOrderBuyMtd(query){
        const { startMonth } = query
        const _startMonth = moment(startMonth).format('YYYY-MM-DD HH:mm:ss')
        const startTime = moment(_startMonth).startOf('month').format('YYYY-MM-DD HH:mm:ss')
        const endTime = moment(_startMonth).endOf('month').format('YYYY-MM-DD HH:mm:ss')
        // const sql = `SELECT count(*) as c FROM(${orderRepBuyRateSql(startTime,endTime)}) t2`;
        return new Promise((resolve,reject)=>{
            this.order.query(orderRepBuyRateSql(startTime,endTime),(err,res,fields)=>{
                if (err) {
                    reject(err);
                }
                let _res = JSON.stringify(res)
                resolve(JSON.parse(_res),fields);
            })
        })
    }


    getEveryMonthRepBuyMtd(query){
        const { startMonth,endMonth } = query
        return new Promise((resolve,reject)=>{
            this.order.query('',(err,res,fields)=>{
                if (err) {
                    reject(err);
                }
                let _res = JSON.stringify(res)
                resolve(JSON.parse(_res),fields);
            })
        })
    }

    getOrderGroupEveryRepBuyMtd(query){
        const { startMonth,endMonth } = query
        return new Promise((resolve,reject)=>{
            this.order.query(orderGroupEveryRepBuy(startMonth,endMonth),(err,res,fields)=>{
                if (err) {
                    reject(err);
                }
                let _res = JSON.stringify(res)
                resolve(JSON.parse(_res),fields);
            })
        })
    }

}