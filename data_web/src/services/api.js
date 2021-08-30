import axios from 'axios'


export const findPostList = (params) => axios.get(`/common/region/provinces/nesting`, { params })

export const getEtsTimeLively = (params) => axios.get(`/server/getEtsTimeLively`, { params })

export const getEtsAllTimeLively = (params) => axios.get(`/server/getEtsAllTimeLively`, { params })

export const getEtsEvenyDayLively = (params) => axios.get(`/server/getEtsEvenyDayLively`, { params })

export const getEtsLookProductNumber = (params) => axios.get(`/server/getEtsLookProductNumber`, { params })

export const getEtsAllPagePath = (params) => axios.get(`/server/getEtsAllPagePath`, { params })

export const getEtsGroupAll = (params) => axios.get(`/server/getEtsGroupAll`, { params })

export const getOrderRepBuyRateAct = (params) => axios.get(`/server/getOrderRepBuyRateAct`, { params })

export const getOrderEveryRepBuyRateAct = (params) => axios.get(`/server/getOrderEveryRepBuyRateAct`, { params })

export const getOrderGroupEveryRepBuyAct = (params) => axios.get(`/server/getOrderGroupEveryRepBuyAct`, { params })


export const login = (params) => axios.post('https://staging-b2b-gateway.hosjoy.com/auth/login',params)

export const tracking = (params) => axios.post('https://staging-hbp.hosjoy.com/ets/api/event-tracks',params)

