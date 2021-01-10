import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class HashRouter extends Component {
    static childContextTypes = {
      location: PropTypes.object,
      history: PropTypes.object
    }
    getChildContext(){
      let that = this;
      return {
        location: this.state.location,
        history: {
          push(path) {
            if(typeof path === 'object'){
              // 保存原始状态
              let {pathname, state} = path;
              that.setState({
                location: {
                  ...that.state.location,
                  state
                }
              }, () => {
                window.location.hash = pathname;
              })
            }else {
              window.location.hash = path;
            }
          }
        }
      }
    }
    constructor(props){
      super(props);
      this.state={
        location: {
          pathname: window.location.hash.slice(1) || '/',
          state: {}
        }
      };
    }
    componentDidMount(){
      window.location.hash = window.location.hash || '/';
      // rerender
      let render = () => {
        console.log('rerender');
        this.setState({
          location: {
            ...this.state.location,
            pathname: window.location.hash.slice(1) || '/'
          }
        });
      }
      window.addEventListener('hashchange', render)
    }
    render(){
      return this.props.children ? React.Children.only(this.props.children): null;
    }
} 