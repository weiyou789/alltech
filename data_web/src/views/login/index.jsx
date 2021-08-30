import React, {useState,useRef,useEffect} from 'react';
// import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Checkbox } from 'antd';
import { login, tracking } from '../../services/api'
import jwtDecode from 'jwt-decode'


import './index.scss'

const Login = (props) => {
    const onFinish = async (values) => {
        const {username,password} = values
        const {data} = await login({username,password})
        const {access_token,refresh_token} = data
        const userInfo = jwtDecode(access_token)
        console.log(userInfo)
        const { principal } = userInfo
        localStorage.setItem('token', access_token)
        // localStorage.setItem('userInfo', userInfo)
        tracking({
            type: 1,
            user_name: principal.name,
            login_name: principal.username,
            user_agent: 'dfx_data_server'
        })
        // history.push('/dfxData')
        window.location.href = '/dfxData'
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    /*useEffect(()=>{
        localStorage.clear()
    },[])*/

    return (
        <div className="login">
            <div className="title_tip">
                <h1 className="title">
                    单分享数据服务平台
                </h1>
                <h2 className="tip">
                    (请使用BOSS账号登录)
                </h2>
            </div>

            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 16 }}>
                    <Checkbox>记住密码</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    <Button type="primary" block htmlType="submit">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login
