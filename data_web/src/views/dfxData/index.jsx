import React, {useState,useRef,useEffect} from 'react';
import { Button,DatePicker,message,Select,Input } from 'antd';
import { useAsyDispatch } from '@/hooks'
import RenderEcharts from './components/RenderEcharts'
import * as actions from '@/redux/dfxDataRedux'
import moment from 'moment';
import './index.scss'

const { RangePicker } = DatePicker;
const { Option } = Select;

function disabledDate3(current) {
    // Can not select days before today and today
    return current < moment('2020-6') || current > moment(new Date(),'YYYY-MM');
}

function disabledDate2(current) {
    // Can not select days before today and today
    return current < moment('2019-2-1 00:00:00') || current > moment(new Date(),'YYYY-MM-DD HH:mm').add(+1,'day');
}

const DfxData = () => {
    const [loadings,setLoadings] = useState({loadingsArr:[false,false,false,false,false,false]}) //纯数组里的值变化不会触发渲染，所以声明一个对象保存
    const [actives,setActives] = useState({activesArr:['now','dfx','dfx']})
    const [dateTime,setDateTime] = useState({
        dateTimeArr:[
            {
                startTime:'',
                endTime:'',
            },
            {
                startTime:'2021-06-01 00:00:00',
                endTime:'2021-06-07 23:59:59',
            },
            {
                selectMonth:''
            },
            {
                startMonth:'2021-01',
                endMonth:'2021-05',
            },
            {
                startTime:'2021-04-01 00:00:00',
                endTime:'2021-06-01 23:59:59',
            },
            {
                startTime:'2021-01',
                endTime:'2021-05',
            }
        ]
    })
    const [pagePath,setPagePath] = useState('')
    const main1 = useRef(null)
    const main2 = useRef(null)
    const main3 = useRef(null)
    const store =  useAsyDispatch(actions)
    const { asyncDispatch,state } = store
    const {getAllPagePathData,getAllTimeLivelyData,getOrderRepBuyRateData,getOrderEveryRepBuyRateData,getOrderGroupEveryRepBuyData,getEvenyDayLivelyData,getLookProductNumberData} = asyncDispatch
    const renderLoading = (i,status) => {//按钮loading加载控制开关
        let loadingsArr = loadings.loadingsArr
        loadingsArr[i] = status
        setLoadings({loadingsArr})
    }

    const getAllTimeLively = async (e,i) => {//获得用户活跃数
        const { dateTimeArr } = dateTime
        if(dateTimeArr[i].startTime&&dateTimeArr[i].endTime){
            renderLoading(i,true)
            const params = {...dateTimeArr[i]}
            await getAllTimeLivelyData(params)
            renderLoading(i,false)
        } else {
            message.info('请选择日期')
        }
    }

    const getAllPagePath = async (e,i) => {//获得链接访问数
        const { dateTimeArr } = dateTime
        let _pagePath = encodeURIComponent(pagePath)
        if(dateTimeArr[i].startTime&&dateTimeArr[i].endTime&&pagePath){
            renderLoading(i,true)
            const params = {...dateTimeArr[i],pagePath:_pagePath}
            await getAllPagePathData(params)
            renderLoading(i,false)
        } else {
            message.info('请选择日期和填入路径')
        }
    }

    const getOrderRate = async (e,i,type) => {//获取当月会员复购数据or获取次月会员复购数据
        const { dateTimeArr } = dateTime
        if(dateTimeArr[i].selectMonth){
            renderLoading(i,true)
            const params = {startMonth:dateTimeArr[i].selectMonth}
            if(type*1===1){
                await getOrderRepBuyRateData(params)
            } else if(type*1===2){
                await getOrderEveryRepBuyRateData(params)
            }
            renderLoading(i,false)
        } else {
            message.info('请选择日期')
        }
    }

    const getOrderGroupEveryRepBuy = async(e,i,type) => {//获取会员购买数据(折线图)
        const { dateTimeArr } = dateTime
        const { activesArr } = actives
        if(activesArr[type]==='next'){
            message.info('还没开发好，先等等吧')
            return
        }
        if(dateTimeArr[i].startMonth&&dateTimeArr[i].endMonth&&activesArr[type]){
            renderLoading(i,true)
            const params = {...dateTimeArr[i],type:activesArr[type]}
            await getOrderGroupEveryRepBuyData(params)
            renderLoading(i,false)
        } else {
            message.info('请选择日期')
        }
    }

    const getEvenyDayLively = async(e,i,type) => {//获得用户日活跃数(折线图)
        const { dateTimeArr } = dateTime
        const { activesArr } = actives
        if(dateTimeArr[i].startTime&&dateTimeArr[i].endTime&&activesArr[type]){
            renderLoading(i,true)
            const params = {...dateTimeArr[i],type:activesArr[type]}
            await getEvenyDayLivelyData(params)
            renderLoading(i,false)
        } else {
            message.info('请选择日期')
        }
    }

    const getLookProductNumber = async(e,i,type) => {//获得用户商品浏览数(柱状图)
        const { dateTimeArr } = dateTime
        const { activesArr } = actives
        if(dateTimeArr[i].startTime&&dateTimeArr[i].endTime&&activesArr[type]){
            renderLoading(i,true)
            const params = {...dateTimeArr[i],type:activesArr[type]}
            await getLookProductNumberData(params)
            renderLoading(i,false)
        } else {
            message.info('请选择日期')
        }
    }


    const dateSelect = (date,dateString,i) => {
        let dateTimeArr = dateTime.dateTimeArr
        if(i*1===2){
            dateTimeArr[i] = {
                selectMonth:dateString
            }
        } else if(i*1===3){
            const [startMonth,endMonth] = dateString
            dateTimeArr[i] = {
                startMonth,
                endMonth
            }
        } else {
            const [startTime,endTime] = dateString
            dateTimeArr[i] = {
                startTime,
                endTime
            }
        }
        setDateTime({dateTimeArr})
    }

    const typeSelect = (type,i) => {
        let activesArr = actives.activesArr
        activesArr[i] = type
        setActives({activesArr})
    }

    const onChange = (e) =>{
        setPagePath(e.target.value)
    }

    useEffect(() => {
        getOrderGroupEveryRepBuy(undefined,3,0)
        getEvenyDayLively(undefined,4,1)
        getLookProductNumber(undefined,5,2)
    },[]); // eslint-disable-line react-hooks/exhaustive-deps

    const { LivelyData,pagePathData,orderData,orderLineData,livelyLineData,productNumberBarData } = state

    return (
        <div className="question-list">
            <ul className="panel center">
                <li>
                    <div className="opts">
                        <div className="btn">
                            <Button loading={loadings.loadingsArr[0]} onClick={(e)=>getAllTimeLively(e,0)} type="primary">获得用户活跃数</Button>
                        </div>
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            onChange={(date,dateString)=>dateSelect(date,dateString,0)}
                        />
                    </div>
                    <h2>单分享用户活跃数：{LivelyData.listDfx}</h2>
                    <h2>小程序用户活跃数：{LivelyData.listMin}</h2>
                    <h2>用户总活跃数（去重）：{LivelyData.listAll}</h2>
                </li>
                <li>
                    <div className="opts">
                        <div className="btn">
                            <Button loading={loadings.loadingsArr[1]} onClick={(e)=>getAllPagePath(e,1)} type="primary">获得链接访问数</Button>
                        </div>
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            disabledDate={disabledDate2}
                            defaultValue={[moment('2021-06-01 00:00:00', 'YYYY-MM-DD HH:mm'), moment('2021-06-07 23:59:59', 'YYYY-MM-DD HH:mm')]}
                            format="YYYY-MM-DD HH:mm"
                            onChange={(date,dateString)=>dateSelect(date,dateString,1)}
                        />
                        <div className="inputText">
                            <Input placeholder="请输入正确的链接格式，例如：/xx/xx/xx" defaultValue={pagePath} onChange={onChange} />
                        </div>
                    </div>
                    <h2>单分享PV：{pagePathData.dfxPv}</h2>
                    <h2>小程序PV：{pagePathData.minPv}</h2>
                    <h2>单分享UV：{pagePathData.dfxUv}</h2>
                    <h2>小程序UV：{pagePathData.minUv}</h2>
                </li>
                <li>
                    <div className="opts">
                        <div className="btn">
                            <Button loading={loadings.loadingsArr[2]} style={{marginRight:'20px'}} onClick={(e)=>getOrderRate(e,2,1)} type="primary">获取当月会员复购数据</Button>
                            <Button loading={loadings.loadingsArr[2]} onClick={(e)=>getOrderRate(e,2,2)} type="primary">获取次月会员复购数据</Button>
                        </div>
                        <DatePicker
                            onChange={(date,dateString)=>dateSelect(date,dateString,2)}
                            picker="month"
                        />
                    </div>
                    <h2>当月复购率or次月复购率：{orderData.rate}</h2>
                    <h2>当月企业会员复购率or次月企业会员复购率：{orderData.rate_bus}</h2>
                    <h2>当月复购会员数or当月购买在次月也购买会员数：{orderData.list1}</h2>
                    <h2>当月复购企业会员数or当月购买在次月也购买企业会员数：{orderData.list1_bus}</h2>
                    <h2>当月购买会员数：{orderData.list2}</h2>
                    <h2>当月购买企业会员数：{orderData.list2_bus}</h2>
                </li>

                <li>
                    <div className="opts">
                        <div className="btn">
                            <Button loading={loadings.loadingsArr[3]} onClick={(e)=>getOrderGroupEveryRepBuy(e,3,0)} type="primary">获取会员购买数据</Button>
                        </div>
                        <div className="select">
                            <Select defaultValue="now" style={{ width: 200 }} onSelect={(type)=>typeSelect(type,0)}>
                                <Option value="now">当月会员复购数据</Option>
                                <Option value="next">次月会员复购数据</Option>
                            </Select>
                        </div>
                        <RangePicker
                            // showTime={{ format: 'HH:mm' }}
                            disabledDate={disabledDate3}
                            defaultValue={[moment('2021-01', 'YYYY-MM'), moment('2021-05','YYYY-MM')]}
                            format="YYYY-MM"
                            picker="month"
                            onChange={(date,dateString)=>dateSelect(date,dateString,3)}
                        />
                    </div>
                    {RenderEcharts('line',main1,orderLineData)}
                </li>

                <li>
                    <div className="opts">
                        <div className="btn">
                            <Button loading={loadings.loadingsArr[4]} onClick={(e)=>getEvenyDayLively(e,4,1)} type="primary">获得用户日活跃数</Button>
                        </div>
                        <div className="select">
                            <Select defaultValue="dfx" style={{ width: 120 }} onSelect={(type)=>typeSelect(type,1)}>
                                <Option value="dfx">单分享日活</Option>
                                <Option value="min">小程序日活</Option>
                                <Option value="all">总日活</Option>
                            </Select>
                        </div>
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            disabledDate={disabledDate2}
                            defaultValue={[moment('2021-04-01 00:00:00', 'YYYY-MM-DD HH:mm'), moment('2021-06-01 23:59:59', 'YYYY-MM-DD HH:mm')]}
                            format="YYYY-MM-DD HH:mm"
                            onChange={(date,dateString)=>dateSelect(date,dateString,4)}
                        />
                    </div>
                    {RenderEcharts('line',main2,livelyLineData)}
                </li>

                <li>
                    <div className="opts">
                        <div className="btn">
                            <Button loading={loadings.loadingsArr[5]} onClick={(e)=>getLookProductNumber(e,5,2)} type="primary">获得用户商品浏览数</Button>
                        </div>
                        <div className="select">
                            <Select defaultValue="dfx" style={{ width: 200 }} onSelect={(type)=>typeSelect(type,2)}>
                                <Option value="dfx">单分享月商品浏览数</Option>
                                <Option value="min">小程序月商品浏览数</Option>
                                <Option value="all">月总商品浏览数</Option>
                            </Select>
                        </div>
                        <RangePicker
                            // showTime={{ format: 'HH:mm' }}
                            disabledDate={disabledDate3}
                            defaultValue={[moment('2021-01', 'YYYY-MM'), moment('2021-05','YYYY-MM')]}
                            format="YYYY-MM"
                            picker="month"
                            onChange={(date,dateString)=>dateSelect(date,dateString,5)}
                        />
                    </div>
                    {RenderEcharts('bar',main3,productNumberBarData)}
                </li>

            </ul>
        </div>
    );
}

export default DfxData
