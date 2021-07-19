import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './router'
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import './styles/base.scss'
import 'antd/dist/antd.css';
import './services/axios.js'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// @RootHoc()
class Root extends Component {
    render () {
        return <ConfigProvider locale={zhCN}>
            <AppRouter />
        </ConfigProvider>
    }
}

ReactDOM.render(<Root />, document.getElementById('root'))