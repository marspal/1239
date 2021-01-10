import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {pathToRegexp} from 'path-to-regexp';
export default class Route extends Component {
  constructor(props){
    super(props);
    let {path} = props; // /user/detail/:id
    this.keys = [];
    this.regExp = pathToRegexp(path, this.keys, {end: false});
    this.keys = this.keys.map(key => key.name);
  }
  static contextTypes = {
    location: PropTypes.object,
    history: PropTypes.object
  }
  render(){
    const {path, component: Component, render, children} = this.props;
    const {location, history} = this.context;
    let result = location.pathname.match(this.regExp);
    console.log(this.regExp, result);
    let props = {
      location,
      history
    }
    if(result){
      let [url, ...values] = result;
      props.match  = {
        url,
        path,
        params: this.keys.reduce((memo, key, index) => {
          memo[key] = values[index];
          return memo;
        }, {})
      }
      if(render){
        return render(props);
      }else if(Component){
        return <Component {...props}/>;
      } else if(typeof children === 'function'){
        return children(props);
      }else{
        return null;
      }
    }else if(children){
      console.log(children, '===');
      return children(props);
    }
    return null;
  }
}