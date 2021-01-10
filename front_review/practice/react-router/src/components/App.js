import React, { Component } from 'react';
// import {Link, HashRouter as Router} from 'react-router-dom';
import {Link, HashRouter as Router} from '../react-router';
import MenuLink from './MenuLink';
export default class App extends Component {
  render(){
    return(
      // 容器主键
      <Router>
        <div className="container">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">管理系统</div>
            </div>
            <ul className="nav nav-bar">
              <MenuLink to="/home">首页</MenuLink>
              <MenuLink to="/user">用户管理</MenuLink>
              <MenuLink to="/profile">个人设置</MenuLink>
            </ul>
          </nav>
          <div className="row">
            <div className="col-md-12">
              {this.props.children}
            </div>
          </div>
        </div>
      </Router>
    );
  }
}