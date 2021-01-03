import React, {Component} from 'react';
import './App.css';

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false,
      time: new Date().getSeconds()
    };
    this.timerId = setInterval(() => {
      this.setState({
        time: new Date().getSeconds()
      });
    }, 1000)
  }
  static getDerivedStateFromProps(nextProps, prevState){
    console.log(nextProps, prevState);
    return null;
  }
  componentWillUnmount(){
    clearInterval(this.timerId);
  }
  shouldComponentUpdate(props, state){
    console.log(props, state);
    return true;
  }
  render(){
    console.log('render');
    return <div>asd</div>
  }
}

export default App;
