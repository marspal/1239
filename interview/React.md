## React学习

> 1. React Hooks源码学习

- state状态更新
```js
class Update{
  constructor(payload, nextUpdate){
    this.payload = payload;
    this.nextUpdate = nextUpdate;
  }
}

class UpdateQueue {
  constructor(){
    this.baseState = null; // 原生状态
    this.firstUpdate = null; // 第一个更新
    this.lastUpdate = null; // 最后一个更新
  }

  enqueueUpdate(update){
    if(this.firstUpdate === null){
      this.firstUpdate = this.lastUpdate = update;
    } else {
      this.lastUpdate.nextUpdate = update;
      this.lastUpdate = update;
    }
  }

  // 1. 获取老状态、然后遍历这个链表，进行更新
  forceUpdate(){
    let currentState = this.baseState || {};
    let currentUpdate = this.firstUpdate;
    while (currentUpdate) {
      let nextState = typeof currentUpdate.payload === 'function'?
        currentUpdate.payload(currentState) : currentUpdate.payload;
      currentState = {...currentState, ...nextState};
      currentUpdate = currentUpdate.nextUpdate;
    }
    this.firstUpdate = this.lastUpdate = null;
    this.baseState = currentUpdate;
    return currentState;
  }
}

// 计数器: {number: 0} setState({number: 1}); setState(state => ({number: state.number + 1}));
let queue = new UpdateQueue();
queue.enqueueUpdate(new Update({name: '珠峰'}));
queue.enqueueUpdate(new Update({number: 0}));
queue.enqueueUpdate(new Update((state) => ({number: state.number + 1})));
queue.enqueueUpdate(new Update((state) => ({number: state.number + 1})));
console.log(queue.forceUpdate()); 
```
