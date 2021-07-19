/**
 * Created by admin on 2021/7/19.
 */
import React from 'react';
import * as echarts from 'echarts'
const RenderEcharts = (type,ref,echartsData) => {
    const {xAxisData,legendData,seriesData} = echartsData
    if(ref.current&&xAxisData.length>0&&legendData.length>0&&seriesData.length>0){
        const EchartsInstance = echarts.init(ref.current)
        let _seriesData = seriesData.map((item,index)=>{
            if(type==='line'){
                return {
                    name: item.name,
                    data: item.data,
                    type: 'line',
                    smooth: true,
                    label: {
                        show: true,
                        position: 'top'
                    }
                }
            } else if(type==='bar'){
                return {
                    name: item.name,
                    data: item.data,
                    type: 'bar',
                    barWidth: '60%',
                    label: {
                        show: true,
                        position: 'top'
                    }
                }
            }
        })

        let tooltip = type==='line'?{
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            }
        }:{
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        }
        let xAxis = type === 'line'?{
            type: 'category',
            boundaryGap: false,
            data: xAxisData
        }:{
            type: 'category',
            data: xAxisData,
            axisTick: {
                alignWithLabel: true
            }
        }
        let option = {
            tooltip,
            legend: {
                data:legendData
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis,
            yAxis: {
                type: 'value'
            },
            series: _seriesData
        }
        EchartsInstance.setOption(option)
    }

    return (
        <div className="main" ref={ref}>

        </div>
    )
}

export default RenderEcharts