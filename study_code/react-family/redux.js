/**
 * @file redux 从0开始实现
 * @author andyxu
 */
module.exports = createStore;
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
