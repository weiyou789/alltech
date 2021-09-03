import axios from 'axios'


export const findPostList = (params) => axios.get(`/common/region/provinces/nesting`, { params })

export const getEtsTimeLively = (params) => axios.get(`/getEtsTimeLively`, { params })

export const getEtsAllTimeLively = (params) => axios.get(`/getEtsAllTimeLively`, { params })

export const getEtsEvenyDayLively = (params) => axios.get(`/getEtsEvenyDayLively`, { params })

export const getEtsLookProductNumber = (params) => axios.get(`/getEtsLookProductNumber`, { params })

export const getEtsAllPagePath = (params) => axios.get(`/getEtsAllPagePath`, { params })

export const getEtsGroupAll = (params) => axios.get(`/getEtsGroupAll`, { params })

export const getOrderRepBuyRateAct = (params) => axios.get(`/getOrderRepBuyRateAct`, { params })

export const getOrderEveryRepBuyRateAct = (params) => axios.get(`/getOrderEveryRepBuyRateAct`, { params })

export const getOrderGroupEveryRepBuyAct = (params) => axios.get(`/getOrderGroupEveryRepBuyAct`, { params })


export const login = (params) => axios.post('https://staging-b2b-gateway.hosjoy.com/auth/login',params)

export const tracking = (params) => axios.post('https://staging-hbp.hosjoy.com/ets/api/event-tracks',params)

