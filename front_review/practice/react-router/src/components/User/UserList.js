import React, {Component} from 'react';
import { Link } from '../../react-router';

export default class UserList extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: []
    };
  }
  componentDidMount(){
    let userStr = localStorage.getItem('users');
    let users = userStr? JSON.parse(userStr): [];
    this.setState({users});
  }
  render(){
    return <ul className="list-group">
      {this.state.users.map(user=><li key={user.id} className="list-group-item">
        <Link to={'/user/detail/'+user.id}>{user.username}</Link></li>)}
    </ul>
  }
}