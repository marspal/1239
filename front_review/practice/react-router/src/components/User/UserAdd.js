import React, {Component} from 'react';
export default class UserAdd extends Component {
  handleSubmit = (event) => {
    event.preventDefault();
    let username = this.username.value;
    let user = {id: Date.now(), username};
    let userStr = localStorage.getItem('users');
    let users = userStr? JSON.parse(userStr): [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    this.props.history.push("/user/list");
  }
  render(){
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label>用户名:</label>
          <input ref={ input => this.username = input} className="form-control"></input>
        </div>
        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="提交"/>
        </div>
      </form>
    );
  }
}