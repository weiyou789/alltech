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
            message.info('???????????????')
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
            message.info('??????????????????????????????')
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
            message.info('???????????????')
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
            message.info('??????????????????????????????')
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
                    axisPointer: {            // ??????????????????????????????????????????
                        type: 'line'        // ??????????????????????????????'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['??????']
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
                    name: '??????',
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
            message.info('???????????????')
        }

    }


    renderLineChart1 = async (e) => {
        const {startTime_5,endTime_5,type_4} = this.state
        console.log(startTime_5,endTime_5)
        if(type_4==='next'){
            message.info('??????????????????????????????')
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
                    axisPointer: {            // ??????????????????????????????????????????
                        type: 'line'        // ??????????????????????????????'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['???????????????', '???????????????', '?????????????????????', '?????????????????????']
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
                    scale: true, //?????????
                },
                series: [
                    {
                        name: '???????????????',
                        type: 'line',
                        data: dm,
                        smooth: true,
                        label: {
                            show: true,
                            position: 'top'
                        }
                    },
                    {
                        name: '???????????????',
                        type: 'line',
                        data: rm,
                        smooth: true,
                        label: {
                            show: true,
                            position: 'top'
                        }
                    },
                    {
                        name: '?????????????????????',
                        type: 'line',
                        data: dm_bus,
                        smooth: true,
                        label: {
                            show: true,
                            position: 'top'
                        }
                    },
                    {
                        name: '?????????????????????',
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
            message.info('???????????????')
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
                    axisPointer: {            // ??????????????????????????????????????????
                        type: 'shadow'        // ??????????????????????????????'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['??????????????????']
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
                        name: '??????????????????',
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
            message.info('???????????????')
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
                                <Button loading={loadings_1} onClick={(e)=>this.getLively(e)} type="primary">?????????????????????</Button>
                            </div>
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                onChange={(date,dateString)=>this.dateSelect(date,dateString,1)}
                            />
                        </div>
                        <h2>???????????????????????????{LivelyData.listDfx}</h2>
                        <h2>???????????????????????????{LivelyData.listMin}</h2>
                        <h2>?????????????????????????????????{LivelyData.listAll}</h2>
                    </li>
                    <li>
                        <div className="opts">
                            <div className="btn">
                                <Button loading={loadings_4} onClick={(e)=>this.getPagePath(e)} type="primary">?????????????????????</Button>
                            </div>
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                disabledDate={disabledDate2}
                                defaultValue={[moment('2021-06-01 00:00:00', 'YYYY-MM-DD HH:mm'), moment('2021-06-07 23:59:59', 'YYYY-MM-DD HH:mm')]}
                                format="YYYY-MM-DD HH:mm"
                                onChange={(date,dateString)=>this.dateSelect(date,dateString,4)}
                            />
                            <div className="inputText">
                                <Input placeholder="??????????????????????????????????????????/xx/xx/xx" defaultValue={pagePath} onChange={onChange} />
                            </div>
                        </div>
                        <h2>?????????PV???{pagePathData.dfxPv}</h2>
                        <h2>?????????PV???{pagePathData.minPv}</h2>
                        <h2>?????????UV???{pagePathData.dfxUv}</h2>
                        <h2>?????????UV???{pagePathData.minUv}</h2>
                    </li>

                    <li>
                        <div className="opts">
                            <div className="btn">
                                <Button loading={loadings_5} style={{marginRight:'20px'}} onClick={(e)=>this.getOrderRate(e,1)} type="primary">??????????????????????????????</Button>
                                <Button loading={loadings_5} onClick={(e)=>this.getOrderRate(e,2)} type="primary">??????????????????????????????</Button>
                            </div>
                            <DatePicker
                                onChange={(date,dateString)=>this.oneDateSelect(date,dateString,1)}
                                picker="month"
                            />
                        </div>
                        <h2>???????????????or??????????????????{orderData.rate}</h2>
                        <h2>???????????????????????????or??????????????????????????????{orderData.rate_bus}</h2>
                        <h2>?????????????????????or??????????????????????????????????????????{orderData.list1}</h2>
                        <h2>???????????????????????????or????????????????????????????????????????????????{orderData.list1_bus}</h2>
                        <h2>????????????????????????{orderData.list2}</h2>
                        <h2>??????????????????????????????{orderData.list2_bus}</h2>
                    </li>

                    <li>
                        <div className="opts">
                            <div className="btn">
                                <Button loading={loadings_6} onClick={(e)=>this.renderLineChart1(e)} type="primary">????????????????????????</Button>
                            </div>
                            <div className="select">
                                <Select defaultValue="now" style={{ width: 200 }} onSelect={(type)=>this.typeSelect(type,4)}>
                                    <Option value="now">????????????????????????</Option>
                                    <Option value="next">????????????????????????</Option>
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
                                <Button loading={loadings_2} onClick={(e)=>this.renderLineChart(e)} type="primary">????????????????????????</Button>
                            </div>
                            <div className="select">
                                <Select defaultValue="dfx" style={{ width: 120 }} onSelect={(type)=>this.typeSelect(type,2)}>
                                    <Option value="dfx">???????????????</Option>
                                    <Option value="min">???????????????</Option>
                                    <Option value="all">?????????</Option>
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
                                <Button loading={loadings_3} onClick={(e)=>this.renderBarChart(e)} type="primary">???????????????????????????</Button>
                            </div>
                            <div className="select">
                                <Select defaultValue="dfx" style={{ width: 200 }} onSelect={(type)=>this.typeSelect(type,3)}>
                                    <Option value="dfx">???????????????????????????</Option>
                                    <Option value="min">???????????????????????????</Option>
                                    <Option value="all">?????????????????????</Option>
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