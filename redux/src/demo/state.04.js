const createStore = function (initState) {
const createStore = function (reducer, initState) {
  let state = initState;
  let listeners = [];

  /*订阅*/
  function subscribe(listener) {
    listeners.push(listener);
  }

  function changeState(newState) {
  function dispatch(action) {
    state = newState;
    state = reducer(state, action);
    /*通知*/
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }
  }

  function getState() {
    return state;
  }

  return {
    subscribe,
    changeState,
    dispatch,
    getState
  }
}
}