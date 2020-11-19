/**
 * @file redux 从0开始实现
 * @author andyxu
 */
module.exports = createStore;
function createStore(initState) {
    let state = initState;
    let listeners = [];
    function subscribe(listener) {
        listeners.push(listener);
    }
    function changeState(newState) {
        state = newState;
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
        changeState,
        getState
    };
}
