import React, {Component} from 'react';
import { Button,DatePicker,message,Select,Input } from 'antd';
import { getEtsAllTimeLively,getEtsEvenyDayLively,getEtsLookProductNumber,getEtsAllPagePath,getOrderRepBuyRateAct,getOrderEveryRepBuyRateAct,getOrderGroupEveryRepBuyAct } from '../../services/api'
import * as echarts from 'echarts'
import moment from 'moment';
import './index.css'

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

class GetDataList extends Component {
    state = {
        startTime_1:'',
        endTime_1:'',
        startTime_2:'2021-04-01 00:00:00',
        endTime_2:'2021-06-01 23:59:59',
        startTime_3:'2021-01',
        endTime_3:'2021-05',
        startTime_4:'2021-06-01 00:00:00',
        endTime_4:'2021-06-07 23:59:59',
        startTime_5:'2021-01',
        endTime_5:'2021-05',
        selectMonth_1:'',
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
        type_2:'dfx',
        type_3:'dfx',
        type_4:'now',
        pagePath:'',
        loadings_1:false,
        loadings_2:false,
        loadings_3:false,
        loadings_4:false,
        loadings_5:false,
        loadings_6:false
    }

    componentDidMount(){
        this.renderLineChart()
        this.renderLineChart1()
        this.renderBarChart()
    }

    oneDateSelect(date,dateString,type){
        console.log(date, dateString);
        let s = 'selectMonth_'+type
        this.setState({
            [s]:new Date(dateString),
        })
    }

    dateSelect(date,dateString,type){
        console.log(type)
        const [startTime,endTime] = dateString
        let s = 'startTime_'+type
        let e = 'endTime_'+type
        this.setState({
            [s]:startTime,
            [e]:endTime
        })
    }

    typeSelect(type,Num){
        let t = 'type_'+Num
        this.setState({
            [t]:type
        })
    }


    onChange = (e) =>{
        // console.log(e.target.value)
        this.setState({
            pagePath:e.target.value
        })
    }

    async getLively(e){
        const {startTime_1,endTime_1} = this.state
        if(startTime_1&&endTime_1){
            this.setState({
                loadings_1:true
            })
            const { data } = await getEtsAllTimeLively({startTime:startTime_1,endTime:endTime_1})
            console.log(1111, data)
            const { result } = data
            this.setState({
                loadings_1:false,
                LivelyData: result
            })
        } else {
            message.info('请选择日期')
        }
    }

    async getPagePath(e){
        const {startTime_4,endTime_4,pagePath} = this.state
        let _pagePath = encodeURIComponent(pagePath)
        if(startTime_4&&endTime_4&&pagePath){
            this.setState({
                loadings_4:true
            })
            const { data } = await getEtsAllPagePath({startTime:startTime_4,endTime:endTime_4,pagePath:_pagePath})
            const { result } = data
            this.setState({
                loadings_4:false,
                pagePathData: result
            })
        } else {
            message.info('请选择日期和填入路径')
        }
    }

    async getOrderRate(e,type){
        const { selectMonth_1 } = this.state
        if(selectMonth_1){
            this.setState({
                loadings_5:true
            })
            let order_data =''
            if(type*1===1){
                order_data = await getOrderEveryRepBuyRateAct({startMonth:selectMonth_1})
                // order_data = await getOrderEveryRepBuyRateAct({startMonth:selectMonth_1})
            } else if(type*1===2){
                // order_data = await getOrderEveryRepBuyRateAct({startMonth:selectMonth_1})
                order_data = await getOrderRepBuyRateAct({startMonth:selectMonth_1})
            }

            const { data:{ result } } = order_data
            this.setState({
                loadings_5:false,
                orderData:result
            })
        } else {
            message.info('请选择日期')
        }
    }

    /*async getGroupEts(e){
        const {startTime_4,endTime_4,pagePath} = this.state
        let _pagePath = encodeURIComponent(pagePath)
        if(startTime_4&&endTime_4&&pagePath){
            this.setState({
                loadings_4:true
            })
            const { data } = await getEtsAllPagePath({startTime:startTime_4,endTime:endTime_4,pagePath:_pagePath})
            const { result } = data
            this.setState({
                loadings_4:false,
                pagePathData: result
            })
        } else {
            message.info('请选择日期和填入路径')
        }
    }*/

    renderLineChart = async (e) => {
        const {startTime_2,endTime_2,type_2} = this.state
        console.log(startTime_2,endTime_2)
        let days,dayLivelys
        if(startTime_2&&endTime_2&&type_2){
            this.setState({
                loadings_2:true
            })
            const { data } = await getEtsEvenyDayLively({startTime:startTime_2,endTime:endTime_2,type:type_2})
            const { result } = data
            days = result.map(item=>item._id)
            dayLivelys = result.map(item=>item.members)
            this.barInstance = echarts.init(this.refs.main_2)
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['日活']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: days
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '日活',
                    data: dayLivelys,
                    type: 'line',
                    smooth: true,
                    label: {
                        show: true,
                        position: 'top'
                    }
                }]
            }
            this.barInstance.setOption(option)
            this.setState({
                loadings_2:false
            })
        } else {
            message.info('请选择日期')
        }

    }


    renderLineChart1 = async (e) => {
        const {startTime_5,endTime_5,type_4} = this.state
        console.log(startTime_5,endTime_5)
        if(type_4==='next'){
            message.info('还没开发好，先等等吧')
            return
        }
        let days,dm_bus,rm_bus,dm,rm
        if(startTime_5&&endTime_5&&type_4){
            this.setState({
                loadings_6:true
            })
            const { data } = await getOrderGroupEveryRepBuyAct({startMonth:startTime_5,endMonth:endTime_5,type:type_4})
            const { result } = data
            days = result.map(item=>item.d)
            dm_bus = result.map(item=>item.dm_bus)
            rm_bus = result.map(item=>item.rm_bus)
            dm = result.map(item=>item.dm)
            rm = result.map(item=>item.rm)
            this.barInstance = echarts.init(this.refs.main_4)
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['购买会员数', '复购会员数', '购买企业会员数', '复购企业会员数']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: days
                },
                yAxis: {
                    type: 'value',
                    scale: true, //自适应
                },
                series: [
                    {
                        name: '购买会员数',
                        type: 'line',
                        data: dm,
                        smooth: true,
                        label: {
                            show: true,
                            position: 'top'
                        }
                    },
                    {
                        name: '复购会员数',
                        type: 'line',
                        data: rm,
                        smooth: true,
                        label: {
                            show: true,
                            position: 'top'
                        }
                    },
                    {
                        name: '购买企业会员数',
                        type: 'line',
                        data: dm_bus,
                        smooth: true,
                        label: {
                            show: true,
                            position: 'top'
                        }
                    },
                    {
                        name: '复购企业会员数',
                        type: 'line',
                        data: rm_bus,
                        smooth: true,
                        label: {
                            show: true,
                            position: 'top'
                        }
                    }
                ]
            }
            this.barInstance.setOption(option)
            this.setState({
                loadings_6:false
            })
        } else {
            message.info('请选择日期')
        }

    }


    renderBarChart = async (e) => {
        const {startTime_3,endTime_3,type_3} = this.state
        let months,monthLookNums
        if(startTime_3&&endTime_3&&type_3){
            this.setState({
                loadings_3:true
            })
            const { data } = await getEtsLookProductNumber({startTime:startTime_3,endTime:endTime_3,type:type_3})
            const { result } = data
            months = result.map(item=>item._id)
            monthLookNums = result.map(item=>item.lookNum)
            this.lineInstance = echarts.init(this.refs.main_3)
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['月商品浏览数']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: months,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '月商品浏览数',
                        type: 'bar',
                        barWidth: '60%',
                        data: monthLookNums,
                        label: {
                            show: true,
                            position: 'top'
                        }
                    }
                ]
            }
            this.lineInstance.setOption(option)
            this.setState({
                loadings_3:false
            })
        } else {
            message.info('请选择日期')
        }

    }

    render() {
        const { LivelyData,pagePathData,orderData,loadings_1,loadings_2,loadings_3,loadings_4,loadings_5,loadings_6,pagePath } = this.state
        const { onChange } = this
        return (
            <div className="question-list">
                <ul className="panel center">
                    <li>
                        <div className="opts">
                            <div className="btn">
                                <Button loading={loadings_1} onClick={(e)=>this.getLively(e)} type="primary">获得用户活跃数</Button>
                            </div>
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                onChange={(date,dateString)=>this.dateSelect(date,dateString,1)}
                            />
                        </div>
                        <h2>单分享用户活跃数：{LivelyData.listDfx}</h2>
                        <h2>小程序用户活跃数：{LivelyData.listMin}</h2>
                        <h2>用户总活跃数（去重）：{LivelyData.listAll}</h2>
                    </li>
                    <li>
                        <div className="opts">
                            <div className="btn">
                                <Button loading={loadings_4} onClick={(e)=>this.getPagePath(e)} type="primary">获得链接访问数</Button>
                            </div>
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                disabledDate={disabledDate2}
                                defaultValue={[moment('2021-06-01 00:00:00', 'YYYY-MM-DD HH:mm'), moment('2021-06-07 23:59:59', 'YYYY-MM-DD HH:mm')]}
                                format="YYYY-MM-DD HH:mm"
                                onChange={(date,dateString)=>this.dateSelect(date,dateString,4)}
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
                                <Button loading={loadings_5} style={{marginRight:'20px'}} onClick={(e)=>this.getOrderRate(e,1)} type="primary">获取当月会员复购数据</Button>
                                <Button loading={loadings_5} onClick={(e)=>this.getOrderRate(e,2)} type="primary">获取次月会员复购数据</Button>
                            </div>
                            <DatePicker
                                onChange={(date,dateString)=>this.oneDateSelect(date,dateString,1)}
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
                                <Button loading={loadings_6} onClick={(e)=>this.renderLineChart1(e)} type="primary">获取会员购买数据</Button>
                            </div>
                            <div className="select">
                                <Select defaultValue="now" style={{ width: 200 }} onSelect={(type)=>this.typeSelect(type,4)}>
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
                                onChange={(date,dateString)=>this.dateSelect(date,dateString,5)}
                            />
                        </div>
                        <div className="main" ref="main_4">

                        </div>
                    </li>

                    <li>
                        <div className="opts">
                            <div className="btn">
                                <Button loading={loadings_2} onClick={(e)=>this.renderLineChart(e)} type="primary">获得用户日活跃数</Button>
                            </div>
                            <div className="select">
                                <Select defaultValue="dfx" style={{ width: 120 }} onSelect={(type)=>this.typeSelect(type,2)}>
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
                                onChange={(date,dateString)=>this.dateSelect(date,dateString,2)}
                            />
                        </div>
                        <div className="main" ref="main_2">

                        </div>
                    </li>

                    <li>
                        <div className="opts">
                            <div className="btn">
                                <Button loading={loadings_3} onClick={(e)=>this.renderBarChart(e)} type="primary">获得用户商品浏览数</Button>
                            </div>
                            <div className="select">
                                <Select defaultValue="dfx" style={{ width: 200 }} onSelect={(type)=>this.typeSelect(type,3)}>
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
                                onChange={(date,dateString)=>this.dateSelect(date,dateString,3)}
                            />
                        </div>
                        <div className="main" ref="main_3">

                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

export default GetDataList;