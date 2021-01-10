// redux简单的状态管理器
let state = {
  count: 1
}

// 使用状态
// console.log(state.count);

// 我们修改状态
state.count = 2;

// ---- count的发布订阅

let listeners = [];

function subscribe(listener){
  listeners.push(listener);
}

function changeCount(count){
  state.count = count;
  listeners.forEach(listener => listener());
}

// 我们来尝试这个简单的技术器

// subscribe(()=>{
//   console.log(state.count);
// });

// 修改state
// changeCount(2);
// changeCount(3);
// changeCount(4);

/**
 * 问题: 只能管理count 不通用
 * 公共代码要封装起来
 */
// const createStore = function(initialState){
// 新增plan参数
const createStore = function(reducer, initialState, rewriteCreateStoreFunc){
  if(typeof initialState === 'function'){
    rewriteCreateStoreFunc = initialState;
    initialState = undefined;
  }
  if(typeof rewriteCreateStoreFunc == "function"){
    const newCreateStore = rewriteCreateStoreFunc(createStore);
    return newCreateStore(reducer, initialState);
  }
  let state = initialState;
  let listeners = [];
  function subscribe(listener){
    listeners.push(listener);
    return function unsubscribe(){
      let index = listeners.indexOf(listener);
      listeners.splice(index, 1)
    }
  }
  // function changeState(action){
  function dispatch(action){
    // 请按照计划 修改state
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }
  function getState(){
    return state;
  }
  /* 注意！！！只修改了这里，用一个不匹配任何计划的 type，来获取初始值 */
  dispatch({type: Symbol()});
  function replaceReducer(nextReducer){
    reducer = nextReducer;
    dispatch({type: Symbol()});
  }
  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer
  };
}

// case1: 
/***
let initState = {
  counter: {
    count: 0,
  },
  info: {
    name: '',
    description: ''
  }
};
let store = createStore(initState);
store.subscribe(()=>{
  let state = store.getState();
  console.log(`${state.info.name}: ${state.info.description}`);
});

store.subscribe(()=>{
  let state = store.getState();
  console.log(`${state.counter.count}`);
});

store.changeState({
  ...store.getState(),
  info: {
    name: '前端九部',
    description: '我们是前端爱好者'
  }
});

store.changeState({
  ...store.getState(),
  counter: {
    count: 1
  }
});
 */
// 问题: changeState 可以随便修改 原因: changeState直接修改state的值
/**
 * 解决办法:
 * 1. 制订一个修改计划, 告诉我的修改计划是什么 设置plan函数 接受state和action返回新的state;
 * 2. 修改 store.changeState 方法，告诉它修改 state 的时候，按照我们的计划修改
 */
function plan(state, action){
  switch(action.type){
    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1
      }
    case "DECREMENT":
      return {
        ...state,
        count: state.count - 1
      }
    default: 
      return state;
  }
}

// case2: 解决随便修改state问题
/**
let initState = {
  count: 0
};

let store = createStore(plan, initState);
store.subscribe(() => {
  let state = store.getState();
  console.log(state.count);
});
store.changeState({
  type: 'INCREMENT'
});
store.changeState({
  type: 'DECREMENT'
});
store.changeState({
  count: 'abc'
});
*/

// 改名changeState: dispatch, plan: reducer 

// reducer的拆分、合并

function combineReducer(reducers){
  let reducerKey = Object.keys(reducers);
  return function(state = {}, action){
    const nextState = {};
    for(let i = 0; i < reducerKey.length; ++i){
      let key = reducerKey[i];
      let reducer = reducers[key];
      let previousState =  state[key];
      nextState[key] = reducer(previousState, action);
    }
    return nextState;
  }
}

// case3:
/*
let state3 = {
  counter: {
    count: 0
  },
  info: {
    name: '前端九部',
    description: '我们都是前端爱好者！'
  }
}
// counterReducer, 一个子reducer
// 注意：counterReducer 接收的 state 是 state.counter
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state;
  }
}
// InfoReducer，一个子reducer
// 注意：InfoReducer 接收的 state 是 state.info
function InfoReducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.name
      }
    case 'SET_DESCRIPTION':
      return {
        ...state,
        description: action.description
      }
    default:
      return state;
  }
}

const combineRe = combineReducer({
  counter: counterReducer,
  info: InfoReducer
});

const store = createStore(combineRe, state3);
store.subscribe(() => {
  let state = store.getState();
  console.log(state.counter.count, state.info.name, state.info.description);
});

store.dispatch({
  type: 'INCREMENT'
});


store.dispatch({
  type: 'SET_NAME',
  name: '前端九部2号'
});
*/

// case4: 加入dispatch 刷新初始值

function counterReducer(state = {count: 0}, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state;
  }
}
// InfoReducer，一个子reducer
// 注意：InfoReducer 接收的 state 是 state.info
function InfoReducer(state = {info: {name: '', description: ''}}, action) {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.name
      }
    case 'SET_DESCRIPTION':
      return {
        ...state,
        description: action.description
      }
    default:
      return state;
  }
}

const reducer = combineReducer({
  counter: counterReducer,
  info: InfoReducer
});
// const store = createStore(reducer);
// const next = store.dispatch;

// console.log(store.getState());


// case5: middleware
// 1. 记录日志 
/*
store.dispatch = (action) => {
  console.log('this state', store.getState());
  console.log('action', action);
  next(action);
  console.log(store.getState());
}

store.dispatch({
  type: 'INCREMENT'
});
*/
// 2. 记录异常
// store.dispatch = (action) => {
//   try{
//     next(action);
//   }catch(err){
//     console.log("错误报告:", err);
//   }
// }

// store.dispatch("aa");
// 多中间件获取

// const loggerMiddleware = (next) => action => {
//   console.log('this state', store.getState());
//   console.log('action', action);
//   next(action);
//   console.log('next state', store.getState());
// }

// const exceptionMiddleware = (next) => (action) => {
//   try {
//     /*loggerMiddleware(action);*/
//     next(action);
//   } catch (err) {
//     console.error('错误报告: ', err)
//   } 
// }

// store.dispatch = exceptionMiddleware(loggerMiddleware(store.dispatch))
// store.dispatch({type: 'INCREMENT'})

// 上诉问题: loggerMiddleware 中包含了外部变量 store 导致我们无法把中间件独立出去
const loggerMiddleware = store => next => action => {
  console.log('this state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
}
const exceptionMiddleware = store => next => action => {
  try {
    next(action);
  }catch(err){
    console.log("内部错误:"+ err);
  }
}

const timeMiddleware = (store) => (next) => (action) => {
  console.log('time', new Date().getTime());
  next(action);
}
// const time = timeMiddleware(store);
// const logger = loggerMiddleware(store);
// const exception = exceptionMiddleware(store);
// store.dispatch = exception(time(logger(next)));
// store.dispatch({type: 'INCREMENT'});

const applyMiddleware = function(...middlewares){
  return function rewriteCreatesStore(oldCreateStore){
    return function newCreateStore(reducer, initState){
      const store = oldCreateStore(reducer, initState);
      // 最小原则
      const simpleStore = {getState: store.getState, dispatch: store.dispatch};
      const chain = middlewares.map(middleware => middleware(simpleStore));
      let dispatch = store.dispatch;
      chain.reverse().map(middleware=>{
        dispatch = middleware(dispatch);
      });
      store.dispatch = dispatch;
      return store;
    }
  }
}

const store = createStore(reducer, {}, applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware));
store.dispatch({type: 'INCREMENT'});

console.log(module.paths);