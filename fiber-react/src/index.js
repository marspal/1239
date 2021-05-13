import React from './react';
import ReactDOM from './react-dom';

let style = {border: '3px solid red', margin: '5px'};
console.log(React);
let element = (
  <div id="A1" style={style}>
    A1
    <div id="B1" style={style}>
      B1
      <div id="C1" style={style}>
        C1
        <div id="D1">D1</div>
        <div id="D2">D2</div>
      </div>
      <div id="C2" style={style}>C2</div>
    </div>
    <div id="B2" style={style}>B2</div>
  </div>
);

console.log(element);
ReactDOM.render(
  element,
  document.getElementById('root')
);

let render2 = document.getElementById('render2');
render2.addEventListener('click', () => {
  let element2 = (
    <div id="A1-new" style={style}>
      A1-new
      <div id="B1-new" style={style}>
        B1-new
        <div id="C1-new" style={style}>
          C1-new
          <div id="D1-new">D1-new</div>
          <div id="D2-new">D2-new</div>
        </div>
        <div id="C2-new" style={style}>C2-new</div>
      </div>
      <div id="B2-new" style={style}>B2-new</div>
      <div id="B3" style={style}>B2</div>
    </div>
  );
  ReactDOM.render(
    element2,
    document.getElementById('root')
  );  
});

let render3 = document.getElementById('render3');
render3.addEventListener('click', () => {
  let element2 = (
    <div id="A1-new" style={style}>
      A1-new
      <div id="B1-new" style={style}>
        B1-new
        <div id="C1-new" style={style}>
          C1-new
          <div id="D1-new">D1-new</div>
          <div id="D2-new">D2-new</div>
        </div>
        <div id="C2-new" style={style}>C2-new</div>
      </div>
      <div id="B2-new" style={style}>B2-new</div>
      <div id="B3" style={style}>B2</div>
    </div>
  );
  ReactDOM.render(
    element2,
    document.getElementById('root')
  );  
});
