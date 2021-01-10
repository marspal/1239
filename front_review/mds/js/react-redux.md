## react-redux

原理: 使用 context Provider

```js
  import React from 'react';
  import PropTypes from 'prop-types';

  export default class Provider extends React.Component {
    static childContextTypes = {
      store: PropTypes.object
    };
    getChildContext(){
      return {store: this.store}
    }
    constructor(props, context){
      super(props, context);
      this.store = props.store;
    }
    render(){
      return this.props.children;
    }
  }

  // 新版api React.createContext
  const ReactReduxContext = React.createContext("");
  export default class Provider extends React.Component {
    constructor(props){
      super(props);
    }
    render(){
      return (
        <ReactReduxContext.Provider value={this.props.store}>
          {this.props.children}
        </ReactReduxContext.Provider>
      );
    }
  }
  
```

完成Provider后，我们就能在组件中通过this.context.store这样的形式取到store，不需要再单独import store。

> connect 实现

```js
import React from 'react';
import PropTypes from 'prop-types';

function connect(mapStateToProps, mapDispatchToProps){
  return function(WrappedComponent){
    return class extends React.Component {
      static contextProps = {
        store: PropTypes.object
      }
      constructor(props, context){
        this.store = this.context.store;
        this.state = mapStateToProps(this.store);
        this.handleStoreChange = this.handleStoreChange.bind(this);
      }
      componentDidMount(){
        this.store.subscribe(this.handleStoreChange);
      }
      handleStoreChange(){
        // 触发更新          
        // 触发的方法有多种,这里为了简洁起见,直接forceUpdate强制更新,读者也可以通过setState来触发子组件更新    
        this.forceUpdate();
      }
      render(
        return <WrappedComponent {...this.props} {...this.state} {...mapDispatchToProps(this.store.dispatch)}/>
      )
    }
  }

  function connect(mapStateToProps, mapDispatchToProps){
    return function(WrappedComponent){
      return class extends React.Component {
        static contextType = ReactReduxContext;
        constructor(props){
          super(props);
          this.state = mapStateToProps(this.context);
          this.handleStoreChange = this.handleStoreChange.bind(this);
        }
        componentDidMount(){
          this.context.subscribe(this.handleStoreChange());
        }
        handleStoreChange(){
          this.forceUpdate();
        }
        render(){
          return <WrappedComponent {...this.props} {...this.state} {...mapDispatchToProps(this.context.dispatch)}/>
        }
      }
    }
  }
}


```
