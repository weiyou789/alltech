import React, { Component } from 'react';
export const RootHoc = (...arg) => (WrappedComponent) => class extends Component {
    state = {
        hasError: false
    }
    static getDerivedStateFromError (error) {
        return { hasError: true };
    }

    componentDidCatch (error, errorInfo) {
        //错误上报，暂时无地方
    }

    render(){
        if (this.state.hasError) {
            return <h1>页面出错，请检查代码</h1>;
        } else {
            return <WrappedComponent {...this.props}  />
        }
    }
}