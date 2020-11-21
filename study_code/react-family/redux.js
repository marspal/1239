/**
 * @file redux 从0开始实现
 * @author andyxu
 * to: reducer拆分
 */
// 日志dispatch action type: 传递 是否需要上传日志
// b
module.exports = {
    createStore,
    combineReducer,
    applyMiddleware
};
function createStore(reducer, initState, rewriteCreateStoreFunc) {
    if (typeof initState === 'function') {
        rewriteCreateStoreFunc = initState;
        initState = undefined;
    }
    if (rewriteCreateStoreFunc) {
        return rewriteCreateStoreFunc(createStore)(reducer, initState);
    }
    let state = initState;
    let listeners = [];
    function subscribe(listener) {
        listeners.push(listener);
        return function unsubscribe() {
            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        };
    }
    function dispatch(action) {
        state = reducer(state, action);
        for (let i = 0; i < listeners.length; ++i) {
            const listener = listeners[i];
            listener();
        }
    }
    function getState() {
        return state;
    }
    function replaceReducer(nextReducer) {
        reducer = nextReducer;
        dispatch({type: Symbol()});
    }
    dispatch({type: Symbol()});
    return {
        subscribe,
        dispatch,
        getState,
        replaceReducer
    };
}

function combineReducer(reducers) {
    const reducerKeys = Object.keys(reducers);
    return function combination(state = {}, action) {
        const nextState = {};
        reducerKeys.forEach(key => {
            const reducer = reducers[key];
            const prevState = state[key];
            nextState[key] = reducer(prevState, action);
        });
        return nextState;
    };
}
/* 接收旧的 createStore，返回新的 createStore */
function applyMiddleware(...middlwares) {
    return function rewriteCreateStoreFunc(oldCreateStore) {
        return function newCreateStore(reducer, initState) {
            let store = oldCreateStore(reducer, initState);
            let dispatch = store.dispatch;
            let chain = [];

            var middlewareAPI = {
                dispatch: (action) => dispatch(action),
                getState: store.getState
            };
            chain = middlwares.map(middleware => middleware(middlewareAPI));
            dispatch = compose(...chain)(dispatch);
            return {
                ...store,
                dispatch
            };
        };
    };
}

function compose(...funcs){
    return arg => funcs.reduceRight((composed, f) => f(composed),arg)
}

// thunk
function createThunkMiddle(extraArgument){ 
    return ({dispatch, getState}) => next => action => {
       if (typeof action === 'function') {
            return action(dispatch, getState, extraArgument);
       }
       return next(action);
    }
}
function isPromise(val){
    return val && typeof val.then === 'function';
}
// thunk-promise
function promiseMiddleware({dispatch, getState}){
    return next => action => {
        if(isPromise(action)){
            return action.then(dispatch)
        }
        return next(action);
    }
}

// redux-compsable-fetch
const fetchMiddleWare = (store) => next => action => {
    if (!action.url || !Array.isArray(action.types)){
        return next(action);
    }
    const [LOADING, SUCCESS, ERROR] = action.types;
    next({
        type: LOADING,
        loading: true,
        ...action
    });
    fetch(action.url, {params: action.params}).then(res=>{
        next({
            type: SUCCESS,
            loading: false,
            payload: result
        });
    }).catch(err => {
        next({
            type: ERROR,
            loading: false,
            error: err
        });
    });
}