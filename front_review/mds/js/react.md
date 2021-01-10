## React 官方代码阅读

### Context

> API 



> setState场景题

- 不可变值 (不能直接修改) 修改后不能影响以前的值
```jsx
// 错误  因为不可不变
this.state.count ++;
this.setState({
  count: this.state.count
})
```
- 可能是异步更新: 因为在setTimeout，自定义dom事件是同步的
- 可能会被合并
```jsx
// 传入对象
this.setState({
  count: this.state.count + 1
})
this.setState({
  count: this.state.count + 1
})
this.setState({
  count: this.state.count + 1
})
// 为什么会被合并，相当于执行了
this.setState({
  count: 1
})
this.setState({
  count: 1
})
this.setState({
  count: 1
})
// 合并 Object.assign({}, {count:1}, {count:1},{count:1})

// 传入函数 从函数中preState获取最新的state
this.setState((preState, props) => {
  return {
    count: preState.count + 1
  }
})
this.setState((preState, props) => {
  return {
    count: preState.count + 1
  }
})
// 称为状态计算函数, 这个函数会将每次更新加入队列中;每次更新时都会提取出当前的state，进行运算得到新的state，就保证了数据的同步更新
this.setState((preState, props) => {
  return {
    count: preState.count + 1
  }
})
```

```js
  componentDidMount(){
    // count 初始值为 0 
    // 合并执行
    this.setState({count: this.state.count + 1});
    console.log('1', this.state.count); // 0
    this.setState({count: this.state.count + 1});
    console.log('2', this.state.count); // 0
    setTimeout(() => {
      // 同步执行
      this.setState({count: this.state.count + 1});
      console.log('3', this.state.count); // 2
    }, 0);
    setTimeout(() => {
      this.setState({count: this.state.count + 1});
      console.log('4', this.state.count); // 3
    }, 0);
    this.setState({count: this.state.count + 1});
    console.log('6', this.state.count); // 0
  }

  //   问题
  componentDidMount(){
    console.log("====");
    this.setState((state, props) => { // 也要加入队列中
      console.log(state); // {count: 0}
      return {count: state.count + 1};
    });
    this.setState({
      count: this.state.count + 1
    });
    this.setState({
      count: this.state.count + 1
    });
    this.setState({
      count: this.state.count + 1
    });
    setTimeout(()=>{
      console.log(this.state.count); // 1
      this.setState({
        count: this.state.count + 1
      })
      console.log(this.state.count); // 2
    },0);
  }

  componentDidMount(){
    this.setState({
      count: this.state.count + 1
    });
    this.setState({
      count: this.state.count + 1
    });
    this.setState({
      count: this.state.count + 1
    });
    console.log("====");
    this.setState((state, props) => {
      console.log(state);
      return {count: state.count + 1}; // 2
    });
    this.setState({
      count: this.state.count + 1 // this.state.count = 0
    });
    // 最终渲染结果1
  }
```

> React 组件的生命周期

- 单组件的生命周期

[图](../images/react生命周期.png)

- 父子组件的生命周期

parent constructor
parent componentWillMount
parent render
child constructor
child componentWillMount
child render
child1 consttructor
child1 componentWillMount
child1 render
child componentDidMount
child1 componentDidMount
parent componentDidMount

更新:
parent shouldComponentUpdate
parent componentWillUpdate
parent render
child componentWillReceiveProps
child shouldComponentUpdate
child componentWillUpdate
child render
child1 componentWillReceiveProps
child1 shouldComponentUpdate
child1 componentWillUpdate
child1 render
child componentDidUpdate
child1 componentDidUpdate
parent componentDidUpdate

> 什么是受控组件

- 表单的值, 受state控制
- 需要执行监听onChange, 更新state
- 对比非受控组件

> 异步组建
- import()
- React.lazy
- React.Suspense



> 异步
```js
function createThunkMiddleware(extraArgument){
  return ({dispatch, getState}) => next => action => {
    if(typeof action === 'function'){
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  }
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
return thunk;
```

> react-router如何配置懒加载(异步加载)

```js
  import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
  import React, {Suspense, lazy} from 'react';

  const Home = lazy(() => import("./routes/Home"));
  const About = lazy(() => import("./routes/About"));

  const App = () => (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/about" component={About}/>
        </Switch>
      </Suspense>
    </Router>
  );
```

> React事件和DOM事件的区别

- 所有事件都挂载document上
- event不是原生的,是SyntheticEvent合成事件对象
- dispatchEvent

> React性能优化(需要学习)、前端性能优化

- 性能优化, 永远都是面试的重点;
- 性能优化对于React更加重要;
- 回顾setState不可变值; (ts中对this.state修改 是只读的)
- SCU
- PureComponent和React.memo
- 不可变值immutable.js

```js
  shouldComponentUpdate(nextProps, nextState){
    if(nextState.count !== this.state.count){
      return true;
    }
    return false;
  }
```

根本原因: 默认返回true, 这是react给你自己定制权力，控制render是否渲染;

注意: 
1. react 默认, 父组件有更新，子组件无条件更新;
2. 性能优化对于 React 更加重要;
3. SCU一定每次都用吗？ 需要的时候才需要用,没有性能问题 没必要优化

SCU 需要配合不可变值使用

为什么?
```js
// 默认返回true, 即React默认重新渲染所有子组件
shouldComponentUpdate(nextProps, nextState){
  return true;
}

onSubmitTitle = (title) => {
  // 正确写法
  // this.setState({
  //   list: this.state.list.concat({id: `id-${Date.now()}`, title}),
   
  // });
  // 演示scu 写错, 原因: 执行操作后 this.state.list 和  this.setState list就一样了
  this.state.list.push({id: `id-${Date.now()}`, title});
  this.setState({
    list: this.state.list
  })

}

// list 数据组件, 这里就有bug 违背不可变值 不能更新
shouldComponentUpdate(nextProps, nextState){
  // _.isEqual 做对象或者数组的深度比较 一次性递归到底 会影响性能
  if(_.isEqual(nextProps.list, this.props.list)){
    return false 
  }
  return true;
}
```

- SCU 默认返回true, 即React默认重新渲染所有子组件
- 必须配合“不可变值”一起使用
- 可先不使用SCU, 有性能问题时在考虑使用

> PureComponent  memo

- PureComponent 实现了浅比较的SCU
- memo 函数组件中的PureComponent
- 浅比较已使用大部分情况(不要做深入比较)
- 但要结合不可变值(明天看)使用
- immutables.js 使用 (彻底 拥抱深拷贝) 基于共享数据(不是深拷贝)，速度快，action

```js
const map1= Immutable.Map({a: 1, b: 2, c:3});
const map2 = map1.set('b', 50);
map1.get('b')  // 2
map2.get('b');  // 50
```

> 如何避免应用出现性能问题
- 了解常见的性能问题场景
1. 事件输入
2. resize
- 时刻注意代码的潜在性能问题
1. 组件的粒度 越细 优化空间越大
- 注重可重构的代码
- 了解如何使用工具定位性能问题
1. React-Dev-tool Chrome-Dev-tool

- 网络性能优化: 自动按需加载
1. 什么是按需加载: 切换页面的时候, 对应的代码才会加载;
2. 使用Webpack的import API
3. 使用react-loadable库实现React异步加载
```tsx
  const Demo = loadable({
    loader: () => import("./demo.tsx"),
    loading: () => <div>loading...</div>
  });
```

使用Reselect 库避免重复计算
创建自动缓存数据的处理流程

> 何时使用异步组件(异步渲染)
1. 时间分片
  Dom操作的优先级低于浏览器原始行为, 例如 键盘和鼠标的输入, 从而保证操作的流畅性;
  a: 虚拟DOM的diff操作可以分片进行
  b: React新unstable_deferredUpdates: 设置优先级
  c: Chrome新的API: requestIdleCallback, 不滚动、不敲击键盘
2. 渲染挂起
  虚拟DOM节点可以等待某个异步操作完成后, 并指定timeout后才完成真正的渲染
- 加载大组件

- 路由懒加载 

> 借助工具发现性能问题
- React DevTool 找到多余的渲染, highLight updates 查看多余的选择 
- Chrome DevTool 定位性能瓶颈
  CPU降速: 6*slowdown
  React相关 的在Performance User Timing


> 事件

- bind this : 修改this的绑定, 
  因为在相关的回调方法中this指向undefined
  注意来回解绑造成的性能回调, 所以尽量在contructor绑定

  使用静态方法:  clickHandler2 = () => {}; // this 指向当前实例;

- 关于event参数
  event.preventDefault();  阻止默认行为
  event.stopPropagation(); 阻止冒泡

  event.target: 指向当前元素,即当前触发元素
  event.currentTarget: 指向当前元素, 假象!!!
  event.nativeEvent是原生事件， 所有的事件都被挂载到document事件上;
  event.nativeEvent.target: 当前触发元素;
  event.nativeEvent.currentTarget: 当前绑定事件的元素, #document

- 自定义传递参数

  this.clickhandle.bind(this, id, title);
  clickhandle(id, title, e) // 会追加event参数

注意:

```
 1. event 是 SyntheticEvent 模拟了所有DOM事件的功能; 
 2. event.target和event.currentTarget一样; 
 3. event.nativeEvent是原生事件， 所有的事件都被挂载到document事件上;
 4. 和DOM、vue事件不一样 event.nativeEvent.target 当前触发元素、 event.nativeEvent.currentTarget
```

```js
import { RefObject, useEffect } from 'react';
function useClickOutSide(ref: RefObject<HTMLElement>, handler: Function){
  useEffect(()=>{
    const listener = (event: MouseEvent) => {
      if(!ref.current || ref.current.contains(event.target as HTMLElement)){
        return;
      }
      handler(event);
    }

    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, [handler, ref]);
}

export default useClickOutSide;
```
为什么要合成事件机制

- 更好的兼容性和夸平台

- 挂载到document 减少内存消耗、避免频繁解绑

- 方便时间的统一管理(如事务机制)

[合成事件机制](../images/合成事件.jpg);

> setState 和 batchUpdate

- 有时异步(普通使用), 有时同步(setTimeout, DOM事件)
- 有时合并(对象形式), 有时不合并(函数形式);

核心要点:
- setState流程
  [setState流程图](../images/setState流程图.jpg)
  
- batchUpdate 机制
```js
    increase = () => {
      // 开始: 处于bathcUpdate
      // isBatchUpdates = true
      this.setState({
        count: this.state.count + 1
      });
      // 结束
      // isBatchUpdates = false
    }

    increase = () => {
      // 开始: 处于bathcUpdate
      // isBatchUpdates = true
      setTimeout(()=>{
        // isBatchUpdates = false
        this.setState({
          count: this.state.count + 1
        });
      });
      // 结束
      // isBatchUpdates = false
    }
  ```

setState同步异步
- setState无所谓同步还是异步
- 看是否能命中batchupdates机制
- 判断isBatchingUpdates

什么能命中batchUPdate机制
- 生命周期(和它调用的函数)
- React中注册的事件（和它调用的函数）
- React可以管理入口; 在入口


- transaction (事务)机制
定义开始逻辑 其它操作 定义一个结束逻辑； 这就是一个transaction; 如下
```js
increase = () => {
  // 在其它地方定义
  // 开始: 处于bathcUpdate
  // isBatchUpdates = true

  // 其它任何操作
  
  // 结束
  // isBatchUpdates = false
}
```
[事务机制](../images/事务机制.jpg) 图为transaction 注释 

```js
// 实例 不能运行 
transaction.initialize = function(){
  console.log("initialize")
}
transaction.close = function(){
  console.log("colse")
}
function method(){
  console.log("abc");
}
transaction.perform(method); // 输出 initialize,abc,colse
```

> 组件的渲染和更新过程

- jsx如何渲染页面 
  [vue渲染](../images/vue渲染流程.jpg);
- setStatez之后如何更新页面
  jsx 即createElement函数
  执行生成vnode
  patch(elem, vnode) 和 patch(vnode, newVnode)
- 面试考察全流程
- dirtyComponents
  回顾setState流程, 保存组件与dirtyComponents中

- 组件的渲染和更新过程
  渲染过程
  1). props state
  2). render() 生成vnode
  3). patch(elem, vnode)
  
  更新过程
  1). setState(newState) --> dirtyComponents(可能有子组件)
  2). render() 生成newVnode
  3). patch(elem, vnode)
- 更新的两个阶段
  1). 上诉patch分为两个阶段:
  a. reconcilation阶段 - 执行diff算法, 纯js计算
  b. commit阶段 - 将diff结果渲染DOM
  2）. 不分可能会有性能问题
  a. JS是当线程, 且和DOM渲染共用一个线程
  b. 当组件足够复杂,组件的更新时计算和渲染都压力大
  c. 同时在有DOM操作的需求(动画、鼠标拖拽等),将卡顿; 解决方案: fiber
- React fiber
  1). 将reconcilation阶段进行任务拆分(commit无法拆分)
  2). DOM需要渲染时暂停, 空闲时回复
  3). requestIdleCallback 知道DOM需要渲染


> Portals

- 组件默认会按照既定的层次嵌套渲染
- 如何让组件渲染到父组件以外?

```js
class App extends React.Component{
  render(){
    return React.createPortal(<div className="modal">{this.props.children}</div>, document.body); // document.body 这里可以任意定义
  }
}
```
- 使用场景:
1. overflow: hidden
2. 父组件z-index值太小, 子组件需要逃离父组件
3. fixed 需要放在body第一层级


> class 组件的ts写法
```js
interface AppProps {
  title: string,
}
const initialState = {count: 0};
type State = Readonly<typeof initialState>
class App extends React.Component<AppProps, State> {
  constructor(props: AppProps){
    super(props);
    this.state = {
      count: 0
    }
  }
  componentDidMount(){
    this.setState({
      count: this.state.count + 1
    });
  }
  render(){
    return (
      <>
        <h1>{this.props.title}</h1>
      </>
    );
  }
}
export default App;

```

> hooks 实践

```js
import React, { useState } from 'react';
import './App.css';
function App(){
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setTimeout(() => {
      setCount(count + 1) // 会执行多次 count在对应的那次渲染中没有变化
    }, 3000);
  }
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>setCount</button>
      <button onClick={handleClick}>Delay SetCount</button>
    </div>
  );
}
export default App;
```

每一次渲染都有独立的状态

```jsx
// 第一帧
const count_1 = 0;
const handleClick_1 = () => {
  const delayAction_1 = () => {
    setCount(count_1 + 1);
  };
  setTimeout(delayAction_1, 3000);
};
//...
<button onClick={handleClick_1}>
//...

// 点击 "setCount" 后第二帧
const count_2 = 1;

const handleClick_2 = () => {
  const delayAction_2 = () => {
    setCount(count_2 + 1);
  };
  setTimeout(delayAction_2, 3000);
};

//...
<button onClick={handleClick_2}>
//...

// 再次点击 "setCount" 后第三帧
const count_3 = 2;

const handleClick_3 = () => {
  const delayAction_3 = () => {
    setCount(count_3 + 1);
  };
  setTimeout(delayAction_3, 3000);
};

//...
<button onClick={handleClick_3}>
//...
```
获取过去或未来帧中的值: 在一个异步回调函数的执行中，获取到 count 最新一帧中的值;
例如，我们把第 n 帧的某个 props 或者 state 通过 useRef 进行保存，在第 n + 1 帧可以读取到过去的，第 n 帧中的值。我们也可以在第 n + 1 帧使用 ref 保存某个 props 或者 state，然后在第 n 帧中声明的异步回调函数中读取到它。

> useRef

```js
function App(){
  const [count, setCount] = useState(1);
  const prevCountRef = useRef(1);
  const prevCount = prevCountRef.current;
  prevCountRef.current = count;

  const handleClick = () => {
    console.log('===', prevCount, count);
    setCount(prevCount + count);
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleClick}>SetCount</button>
    </div>
  );
}
```


> useEffect

执行时机: 完成所有的 DOM 变更并让浏览器渲染页面后
useLayoutEffect: 在 React 完成 DOM 更新后马上同步调用，会阻塞页面渲染。

```js
function App(){
  const [count, setCount] = useState(1);
  useEffect(()=>{
    setTimeout(() => {
      console.log(`You clicked ${count} times`); // 1 times 2 times
    }, 3000)
  });

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>SetCount</button>
    </div>
  );
}
```

> UseMemo

const Comp = () => {
  const data = useMemo(() => ({ type: 'xxx' }), []);
  return <Child data={data}>;
}

const Comp = () => {
  const { current: data } = useRef({ type: 'xxx' });
  return <Child data={data}>;
}


> 关于组件公共逻辑的抽离

- mixin 已被废弃
- HOC: 函数 传入组件返回组件
- Render Props

核心思想: 通过一个函数将class组件state的作为props传递给纯函数组件

```tsx
class Factory extends React.Component {
 constructor(){
  // 多个组件的公共逻辑数据
  this.state = {};
 }
 render(){
  return <div>{this.props.render(this.state)}</div>
 }
}
Factory.propTypes = {
 render: PropTypes.func.isRequired;
}
<Factory render={(props) => <p>{props.a}<p/>}>
```

HOC vs Render Props: 
HOC: 模式简单，但是会增加层级
Render Props: 代码简洁，学习成本较高 
- hooks


### 手写react

 - jsx
 - createElement
 - render
 - Concurrent
 - fibers
 - 提交commit
 - Reconcilation
 - 函数组件
 - hooks
 - class 

> npx creat-react-app react

用js对象描述element

const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "asd"
  }
}

fiber 做diff的时候可以被中断, 解决vdom 树庞大的 递归的问题;

window.requestIdleCallback(callback) 使用浏览器空闲的时候 

有了调度逻辑,之前的vdom是一个树形结构, 他的diff过程是没有办法中断的
为了管理我们vdom树之间的关系, 为了管理我们vdom树之前的关系，我们需要把树形
结构的内部关系，改造成链表(方便终止)，之前的children作为一个数组递归遍历
现在父->子 子->父 子->兄弟都有关系

reconciliation
我们需要保存一个被中断的前fiber节点currentRoot, 以及每一个fiber都有一个字段
存储这上一个状态的fiber
 
并且针对子元素, 设计一个reconcileChildren函数

函数组件一样,只不过type是函数，而不是字符串, 我们需要在处理vdom的时候识别和普通dom区别:
1. 根据type执行不同的函数来初始化fiber
2. 函数组件没有dom属性(没有dom属性,查找dom需要向上循环查找)

> Life of a frame

[要做的事情:](../images/Life_of_a_frame.png)

他们的执行顺序基本是固定的

- Input events(touch、wheel、click、keyPress)
- js执行
- requestAnimation 调用
- 布局Layout
- 绘制

1000ms/60 =  16.7ms  理论上一帧的时间就是16ms; 如果浏览器处理完上述的任务(布局和绘制之后)，还有盈余时间，浏览器就会调用 requestIdleCallback 的回调;
如果浏览器繁忙, requestIdleCallback回调不会被执行, 通过第二个参数 置顶一个超时时间;

注意: 不建议在requestIdleCallback中进行 DOM操作, 因为这可能导致样式重新计算或者重新布局(比如操作DOM后马上调用 getBoundingClientRect)，这些时间很难预估的，很有可能导致回调执行超时，从而掉帧。


TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    |     property 'child' -> object with constructor 'Object'
    --- property 'parent' closes the circle
React怎么实现的?
利用MessageChannel模拟将回调延迟到绘制操作'之后执行: