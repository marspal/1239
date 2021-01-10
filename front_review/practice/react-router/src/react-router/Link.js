import React, {Component} from 'react';
import PropType from 'prop-types';
export default class Link extends Component {
  static contextTypes = {
    history: PropType.object
  }
  render(){
    const {to, children} = this.props;
    return (
      <a onClick={() => this.context.history.push(to)}>{children}</a>
    );
  }
}