let state = {
  count: 1
};
let listeners = [];

/*订阅*/
function subscribe(listener) {
  listeners.push(listener);
}

function changeCount(count) {
  state.count = count;
  /*当 count 改变的时候，通知所有的订阅者*/
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i];
    listener();
  }
}