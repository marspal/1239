import React, {Component} from 'react';
import { Route, Redirect } from '../../react-router';

export default function({component: Component, ...rest}){
    return <Route {...rest} render={(props) => (
        localStorage.getItem('login')? <Component {...props}/>: <Redirect to={{pathname: '/login', state: {from: props.location.pathname}}} />
    )}/>
}
// export default class Protected extends Component {
//     static contextTypes = {
//         location: PropType.object
//     }
//     constructor(props){
//         super(props);
//         this.keys = [];
//         this.regexp = 
//     }
//     render(){
//         const {path, component: Component} = this.props;
//         const {location} = this.context;

//     }
// }