/**
 * Created by admin on 2021/7/19.
 */
import React,{ useReducer } from 'react';
const myContext = React.createContext();
class Store {//简易中间件处理库
    constructor(dispatch,state){
        this.dispatch = dispatch
        this.state = state
    }

    compose(...funcs){
        if (funcs.length === 0) {
            return arg => arg
        }

        if (funcs.length === 1) {
            return funcs[0]
        }
        return funcs.reduce((a, b) => (...args) => a(b(...args)))
    }

    applyMiddleware(...middlewares){
        let dispatch = () => {
            throw new Error('err')
        }
        const middlewareAPI = {
            state:this.state,
            dispatch: (...args) => dispatch(...args)
        }
        const chain = middlewares.map(middleware => middleware(middlewareAPI))
        dispatch = this.compose(...chain)(this.dispatch)
        return {
            state:this.state,
            dispatch
        }
    }
}

function bindActionCreator(actionCreator, dispatch) {
    return function() {
        return dispatch(actionCreator.apply(this, arguments))
    }
}

function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch)
    }

    if (typeof actionCreators !== 'object' || actionCreators === null) {
        throw new Error(
            `接受到的action类型是 ${
                actionCreators === null ? 'null' : typeof actionCreators
                }. ` +
            `要把"import ActionCreators from"改成"import * as ActionCreators from"这种方式传入`
        )
    }

    const boundActionCreators = {}
    for (const key in actionCreators) {
        const actionCreator = actionCreators[key]
        if (typeof actionCreator === 'function') {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
        }
    }
    return boundActionCreators
}

function createThunkMiddleware(extraArgument) {//中间件让useReducer的dispatch支持传入函数
    return ({ dispatch, state }) => next => action => {
        if (typeof action === 'function') {
            return action(dispatch, state, extraArgument);
        }

        return next(action);
    };
}
const thunk = createThunkMiddleware();

const ContextProvider = props => {
    const {INITIAL_STATE,reducer} = props.actions
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const _store = new Store(dispatch,state) //把原生的dispatch传入到工厂里
    const store = _store.applyMiddleware(thunk) //通过中间件把dispatch进行改造
    const asyncDispatch = bindActionCreators(props.actions,store.dispatch)//把每个action处理成dispatch(test())形式
    return (
        <myContext.Provider value={{ state, asyncDispatch }}>
            {props.children}
        </myContext.Provider>
    );
};

const useAsyDispatch = (actions) => {
    const {INITIAL_STATE,reducer} = actions
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const _store = new Store(dispatch,state) //把原生的dispatch传入到工厂里
    const store = _store.applyMiddleware(thunk) //通过中间件把dispatch进行改造
    const asyncDispatch = bindActionCreators(actions,store.dispatch)//把每个action处理成dispatch(test())形式
    return {//返回处理后的actions和state
        asyncDispatch,
        state
    }
}

export {
    useAsyDispatch,
    ContextProvider
}