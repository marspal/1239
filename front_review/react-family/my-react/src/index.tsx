// import React from 'react';
// import ReactDom from 'react-dom';

import React from "./react/index.js";
const ReactDom = React;
const HelloWord = function(props: any){
  const [title, setTitle] = React.useState("11");
  const handleOnchange = (e: any) => {
    console.log(e.target.value);
    setTitle(e.target.value);
  }
  return (
    <div>
      <div>{props.message}</div>
      <input onChange={handleOnchange} />
      <div>{title}</div>
    </div>
  );
}
const App = function(props: any){
  const [count, setCount] = React.useState(1);
  const handleClick = () => {
    setCount(count+1)
  }
  return <div>
  <h1>{props.title} {count}</h1>
  <button onClick={handleClick}>测试哦</button>
  {/* <HelloWord message="Hello World"/> */}
</div>
}
const element: any = <App title="开课吧"/>
ReactDom.render(element, document.getElementById("root"));

/* const element = {
  *   type: "div",
  *   props: {
  *      children: [
  *         {type: h1, props: {children: [{type: 'TEXT', props: {children:[], nodeValue: 开课吧}}]}},
  *         {type: p, props: {children: [{type: 'TEXT', props: {children: [], nodeValue: 全栈课程学习}}]},
  *         {type: a, props: {href: "#", children: [{type: "TEXT", {childrenL [], nodeValue: test}}]}}
  *     ]
  *   }
  * }
  */