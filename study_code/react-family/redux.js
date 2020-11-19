/**
 * @file redux 从0开始实现
 * @author andyxu
 * to: reducer拆分
 */
// 日志dispatch action type: 传递 是否需要上传日志
module.exports = {
    createStore,
    combineReducer,
    applyMiddleware
};
function createStore(reducer, initState, rewriteCreateStoreFunc) {
    if (rewriteCreateStoreFunc) {
        return rewriteCreateStoreFunc(createStore)(reducer, initState);
    }
    let state = initState;
    let listeners = [];
    function subscribe(listener) {
        listeners.push(listener);
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
    dispatch({type: Symbol()});
    return {
        subscribe,
        dispatch,
        getState
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
            const store = createStore(reducer, initState);
            const chain = middlwares.map(middleware => middleware(store));
            store.dispatch = chain.reduceRight((current, next) => {
                return next(current);
            }, store.dispatch);
            return store;
        };
    };
}
