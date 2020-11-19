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
            const store = oldCreateStore(reducer, initState);
            const simpleStore = {getState: store.getState};
            const chain = middlwares.map(middleware => middleware(simpleStore));
            store.dispatch = chain.reduceRight((current, next) => {
                return next(current);
            }, store.dispatch);
            return store;
        };
    };
}
