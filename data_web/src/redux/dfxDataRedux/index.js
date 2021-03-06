import { getEtsAllTimeLively,getEtsAllPagePath,getOrderRepBuyRateAct,getOrderEveryRepBuyRateAct,getEtsEvenyDayLively,getEtsLookProductNumber,getOrderEveryMonthRepBuyRateAct,getOrderNextEveryMonthRepBuyRateAct } from '../../services/api'
import {
    GET_ALL_TIME_LIVELY,
    GET_ALL_PAGE_PATH,
    GET_ORDER_REP_BUY_RATE,
    GET_ORDER_EVERY_REP_BUY_RATE,
    GET_ORDER_GROUP_EVERY_REP_BUY,
    GET_EVERY_DAY_LIVELY,
    GET_LOOK_PRODUCT_NUMBER
} from './actionTypes'

export const INITIAL_STATE = {
    LivelyData:{
        listDfx:0,
        listMin:0,
        listAll:0
    },
    pagePathData:{
        dfxPv:0,
        minPv:0,
        dfxUv:0,
        minUv:0
    },
    orderData:{
        rate: 0,
        rate_bus: 0,
        list1: 0,
        list1_bus: 0,
        list2: 0,
        list2_bus: 0
    },
    orderLineData:{
        xAxisData:[],
        legendData:[],
        seriesData:[]
    },
    livelyLineData:{
        xAxisData:[],
        legendData:[],
        seriesData:[]
    },
    productNumberBarData:{
        xAxisData:[],
        legendData:[],
        seriesData:[]
    }
}


export const getAllTimeLivelyData = (params) => async (dispatch,state) => {
    const { data } = await getEtsAllTimeLively(params)
    const { result } = data
    dispatch({
        type: GET_ALL_TIME_LIVELY,
        payload:{
            LivelyData:result
        }
    })

}

export const getAllPagePathData = (params) => async (dispatch,state) => {
    console.log(params)
    const { data } = await getEtsAllPagePath(params)
    const { result } = data
    dispatch({
        type: GET_ALL_PAGE_PATH,
        payload:{
            pagePathData:result
        }
    })

}

export const getOrderRepBuyRateData = (params) => async (dispatch,state) => {
    console.log(params)
    const { data } = await getOrderEveryRepBuyRateAct(params)
    const { result } = data
    dispatch({
        type: GET_ORDER_REP_BUY_RATE,
        payload:{
            orderData:result
        }
    })

}

export const getOrderEveryRepBuyRateData = (params) => async (dispatch,state) => {
    console.log(params)
    const { data } = await getOrderRepBuyRateAct(params)
    const { result } = data
    dispatch({
        type: GET_ORDER_EVERY_REP_BUY_RATE,
        payload:{
            orderData:result
        }
    })

}

export const getOrderGroupEveryRepBuyData = (params) => async (dispatch,state) => {
    console.log(params)
    const { type } = params
    let _data = '';
    let legendData = '';
    if(type==="now"){
        const { data } = await getOrderEveryMonthRepBuyRateAct(params);
        legendData = ['?????????????????????', '?????????????????????', '?????????????????????', '?????????????????????']
        _data =data;
    } else {
        const { data } = await getOrderNextEveryMonthRepBuyRateAct(params);
        legendData = ['?????????????????????', '?????????????????????', '?????????????????????', '?????????????????????']
        _data =data;
    }
    // const { data } = await getOrderEveryMonthRepBuyRateAct(params);
    // const { result } = data
    console.log(_data)
    let xAxisData = _data.map(item=>item.currentMonth)
    let dataArr = [
        _data.map(item=>item.buyBusMemListCount),
        _data.map(item=>item.buyRepBusMemListCount),
        _data.map(item=>item.buyMemListCount),
        _data.map(item=>item.buyRepMemListCount)
    ]
    //let legendData = ['?????????????????????', '?????????????????????', '???????????????', '???????????????']
    let seriesData = legendData.map((item,index)=>{
        return {
            name:item,
            data:dataArr[index]
        }
    })
    let orderLineData = {
        xAxisData,
        legendData,
        seriesData
    }
    dispatch({
        type: GET_ORDER_GROUP_EVERY_REP_BUY,
        payload:{
            orderLineData
        }
    })

}

export const getEvenyDayLivelyData = (params) => async (dispatch,state) => {
    console.log(params)
    const { data } = await getEtsEvenyDayLively(params)
    const { result } = data
    let dataArr = [
        result.map(item=>item.members)
    ]
    let legendData = ['??????']
    let xAxisData = result.map(item=>item._id)
    let seriesData = legendData.map((item,index)=>{
        return {
            name:item,
            data:dataArr[index]
        }
    })
    let livelyLineData = {
        xAxisData,
        legendData,
        seriesData
    }
    dispatch({
        type: GET_EVERY_DAY_LIVELY,
        payload:{
            livelyLineData
        }
    })

}

export const getLookProductNumberData = (params) => async (dispatch,state) => {
    console.log(params)
    const { data } = await getEtsLookProductNumber(params)
    const { result } = data
    let dataArr = [
        result.map(item=>item.lookNum)
    ]
    let legendData = ['??????????????????']
    let xAxisData = result.map(item=>item._id)
    let seriesData = legendData.map((item,index)=>{
        return {
            name:item,
            data:dataArr[index]
        }
    })
    let productNumberBarData = {
        xAxisData,
        legendData,
        seriesData
    }
    dispatch({
        type: GET_LOOK_PRODUCT_NUMBER,
        payload:{
            productNumberBarData
        }
    })

}




export function reducer (state , action) {
    console.log(state,action)
    return {
        ...state,
        ...action.payload
    }
    /*switch (action.type) {
        case GET_ALL_TIME_LIVELY:
            return {
                ...state,
                ...action.payload
            }
        case GET_ALL_PAGE_PATH:
            return {
                ...state,
                ...action.payload
            }
        case GET_ORDER_REP_BUY_RATE:
            return {
                ...state,
                ...action.payload
            }
        case GET_ORDER_EVERY_REP_BUY_RATE:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }*/
}