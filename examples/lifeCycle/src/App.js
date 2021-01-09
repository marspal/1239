import React from 'react';
import './App.css';
class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      count: 0
    };
    console.log('app contructor');
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('app getDerivedStateFromProps', nextProps, prevState);
    return null;
  }
  componentWillUnmount(){
    // clearInterval(this.timerId);
  }
  shouldComponentUpdate(props, state) {
    console.log('app shouldComponentUpdate', props, state, this.props, this.state);
    return true;
  }
  onIncrementAction = () => {
    let count = this.state.count;
    this.setState({
      count: count + 1
    });
  }
  render(){
    console.log('app render');
    return <div>
      {this.state.count}
      <button onClick={this.onIncrementAction}>+</button>
      <Test count={this.state.count}/> 
    </div>
  }
  getSnapshotBeforeUpdate(props, state) {
    console.log('app getSnapshotBeforeUpdate', props, state);
    return 'app';
  }
  componentDidMount(props, state){
    console.log('app componentDidMount', props, state);
  }
  componentDidUpdate(props, state, snapshot){
    console.log('app componentDidUpdate', props, state, snapshot);
  }
}

class Test extends React.Component {
  constructor(props) {
    console.log("Test constructor");
    super(props);
    this.state = {};
  }
  static getDerivedStateFromProps(nextProps, curState) {
    console.log('Test getDerivedStateFromProps', nextProps, curState);
    return null;
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('Test shouldComponentUpdate', nextProps, nextState, this.props, this.state);
    return true;
  }
  render() {
    console.log('Test render');
    return <div>Test</div>;
  }
  // prevProps, preState
  getSnapshotBeforeUpdate(props, state) {
    console.log('Test getSnapshotBeforeUpdate', props, state);
    return 'test';
  }
  componentDidMount(props, state){
    console.log('Test componentDidMount', props, state);
  }
  // prevProps, preState; snapshot为啥不在component做更新; 因为Didupdate坐了修改，估计dom数据不准确
  componentDidUpdate(props, state, snapshot){
    console.log('Test componentDidUpdate', props, state, snapshot, this.props, this.state);
  }
}

export default App;
