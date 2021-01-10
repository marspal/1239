import React from 'react';
import ReactDOM from 'react-dom';
// import 'bootstrap/dist/css/bootstrap.css';
import App from "./components/App";
import User from "./components/User";
import Login from "./components/Login";
import Protected from './components/User/Protected';
// HashRouter hash变量、BrowserRouter historyApi
// import { HashRouter as Router, Route } from 'react-router-dom';
import { HashRouter as Router, Route, Switch } from './react-router';
const Home = (props, context) => {
    console.log(props, context);
    return <div> 首页 </div>;
};
const Profile = () => <div> 用户设置 </div>;
ReactDOM.render(
    <App>
        <Switch>
            <Route path = "/home" component={Home}/>
            <Route path = "/user" component={User}/>
            <Route path = "/login" component={Login}/>
            <Protected path = "/profile" component={Profile}/>
        </Switch>
    </App>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();