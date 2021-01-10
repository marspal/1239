import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {pathToRegexp} from 'path-to-regexp';
// 匹配到一个后,不在匹配下一个路由 01:08:21

export default class Switch extends Component {
    static contextTypes = {
        location: PropTypes.object
    }
    render(){
        let {location: {pathname}} = this.context;
        let {children} = this.props;
        for(let i = 0; i < children.length; ++i){
            let child = children[i];
            const {path} = child.props;
            if(pathToRegexp(path, [], {end: false}).test(pathname)){
                return child;
            }
        }
        return null;
    }
}