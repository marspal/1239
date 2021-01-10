 import React from 'react';
import { Route, Link } from '../react-router';
import "./menuLink.css"
export default function({to, children}){
   return <Route path={to} children={props=>(
     <li className={(props.match? "active": "")}>
       <Link to={to} className="nav-link">{children}</Link>
     </li>
   )}/>
 }