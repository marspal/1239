const a = require('debug')('worker:a');
const b = require('debug')('worker:b');

function work(){
  a('doing lots of uninteresting work');
  setTimeout(work, Math.random() * 1000);
}

function workb(){
  b('doing some work');
  setTimeout(workb, Math.random() * 1000);
}

work();
workb();