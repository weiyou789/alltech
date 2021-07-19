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

