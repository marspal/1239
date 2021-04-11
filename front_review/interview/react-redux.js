
class Provider extends React.component {
  getChildContext(){
    return {store: this.store}
  }

  constructor(props, context){
    super(props, context);
    this.store = props.store;
  }
  render(){
    return React.Children.only(this.props.children);
  }
}

const connect = (mapStateToProps = state => state, mapDispatch = {}) =>
  WrapComponent => class ConnectComponent extends React.Component {
    static contextTypes = {
      store: PropTypes.object
    }

    constructor(props, context){
      super(props, context);
      this.state = {
        props: {}
      };
    }

    componentDidMount(){
      const {store} = this.context;
      store.subscribe(() => this.update());
      this.update();
    }

    update(){
      const {store} = this.state;
      const stateProps = mapStateToProps(store.state);
      const dispatchProps = mapDispatch(store.dispatch);

      this.setState({
        props: {
          ...this.state.props,
          ...stateProps,
          ...dispatchProps
        }
      });
    }
    render(){
      return <WrapComponent {...this.state.props}/>
    }
  }

  // Connect就是一个高阶组件,接收Provider传递过来的store对象，并订阅
  // store中的数据，如果store中的数据发生改变, 就调用setState组件更新

  // redux-actions
  // Redux最大弊端是样板代码太多、修改数据的链路太长
  // 解决方案： 借助一些工具， 减少创建样板代码的过成

// 解决异步问题
// 使用Redux-thunk: 解决异步action的问题
// 使用Redux-saga, 让异步行为成为架构中独立的一层(saga)