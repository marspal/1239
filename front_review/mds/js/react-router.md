## React-router实现

### 使用了history包

href组成: protocol+auth+host+path+hash
https://user:password@www.baidu.com:8080/p/a/t/h?query=string#hash

```js
  import {createBrowserHistory} from 'history';
  const history = createBrowserHistory();
  // 获取当前的location
  const location = history.location;
  // href 
  const unlisten = history.listen((location, action) => {
    console.log(action, location.pathname, location.state);
  });

  history.push("/home/, {some: 'state'})
  unlisten();
```

``` js
  // history 
  export { default as createBrowserHistory } from './createBrowserHistory';
  export { default as createHashHistory } from './createHashHistory';
  export { default as createMemoryHistory } from './createMemoryHistory';
  export { createLocation, locationsAreEqual } from './LocationUtils';
  export { parsePath, createPath } from './PathUtils';
```

```js
  function getHashPath(){
    // 我们不能使用window.location.hash,因为它不是跨浏览器一致- Firefox将预解码它!
    const href = window.location.href;
    const hashIndex = href.indexOf("#");
    return hashIndex === -1 ? '': href.substring(hashIndex + 1);  
  }
```


``` js 
  // createBrowserHistory
  const PopStateEvent = 'popstate';//变量，下面window监听事件popstate用到
  const HashChangeEvent = 'hashchange';//变量，下面window监听事件hashchange用到

  function createBrowserHistory(props = {}){
    const globalHistory = window.history;
    function push(){ // pushState 

    }
    function replace(){ // replaceState

    }
    // 注册路由监听事件
    let listenerCount = 0;
    function checkDomListeners(delta){
      listenerCount += delta;
      if(listenerCount === 1 && delta === 1){
        window.addEventListener(PopStateEvent, handleHashChange);
      }else if(listenerCount === 0){
        window.removeEventListener(PopStateEvent, handleHashChange);
      }
    }
    function listen(){}
  }
```

V4. 将路由拆成了以下几个包:

- react-router 负责通用的路由逻辑
- react-router-dom 负责浏览器的路由管理
- react-router-native 负责 react-native 的路由管理

React-Router: 三种类型组件

- 路由器组件 (<BrowserRouter>, <HashRouter>);
- 路由组件 (<Route>, <Switch>);
- 导航组件 (<Link>, <NavLink>, <Redirect>);

梳理一个基本流程出来:

- 使用<BrowserRouter> 创建一个专门的history组件, 并注册监听事件
- 使用<Route> 匹配path, 并渲染匹配的组件
- 使用<Link> 跳转到组件

原理:

- 使用Browser Router render一个Router时创建了一个全局的history对象，
  并通过props传递给了Router，而在Router中设置了一个监听函数，使用的是history库的listen，
  触发的回调里面进行了setState向下传递 nextContext。

- 当点击页面的Link是，其实是点击的a标签，只不过使用了 preventDefault 阻止 a 标签的页面跳转；
  通过给a标签添加点击事件去执行 hitsory.push(to);

- 路由改变是会触发 Router 的 setState 的，在 Router 那章有写道：
  每次路由变化 -> 触发顶层 Router 的监听事件 -> Router 触发 setState -> 向下传递新的 nextContext（nextContext 中含有最新的 location）。
- Route 接受新的 nextContext 通过 matchPath 函数来判断 path 是否与 location 匹配，如果匹配则渲染，不匹配则不渲染


```js
class BrowserRouter extends React.Component {
  history = createHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}
```


