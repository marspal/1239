/**
 * @file redux 从0开始实现
 * @author andyxu
 * to: reducer拆分
 */

module.exports = {
    createStore,
    combineReducer
};
function createStore(reducer, initState) {
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
            nextState[key] = reducer(prevState || {}, action);
        });
        return nextState;
    };
}
