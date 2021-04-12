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

> Q: fiber树

Fiber是一个执行单元, 每次执行完一个单元，React检查还剩多少时间，没有时间让出控制权

- fiber之前

```js
let root = {
  key: 'A1',
  children: [
    {
      key: 'B1',
      children: [
        {key: 'C1', children:[]},
        {key: 'C2', children:[]},
      ]
    },
    {
      key: 'B2',
      children: []
    }
  ]
}

function walk(element){
  doWork(element);
  element.children.forEach(walk);
}
function doWork(element) {
  console.log(element.key);
}
walk(root);
```