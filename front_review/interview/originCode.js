function deepCopy(obj, hash = new WeakMap()){
  if(obj instanceof RegExp) return new RegExp(obj);
  if(obj instanceof Date) return new Date(obj);
  if(typeof obj === null || typeof obj !== 'object'){
    return obj;
  }
  if(hash.get(obj)){
    return hash.get(obj);
  }
  var t = new obj.constructor();
  hash.set(obj, t);
  for(let key in obj){
    if(obj.hasOwnProperty(key)){
      t[key] = deepCopy(obj[key], hash);
    }
  }
  return t;
}

Function.prototype.call = function(){
  const [thisArgs, ...args] = [...arguments];
  if(!thisArgs){
    thisArgs = typeof window === 'undefined' ? global : window; 
  }
  thisArgs.func = this;
  var result = thisArgs.func(...args);
  delete thisArgs.func;
  return result;
}

Function.prototype.apply = function(){
  let result;
  // 区别在于args是数组; ...args表示数组
  const [thisArgs, args] = [...arguments];
  if(!thisArgs){
    thisArgs = typeof window === 'undefined'? global : window;
  }
  thisArgs.func = this;
  if(!args){
    result = thisArgs.func();
  } else {
    result = thisArgs.func(...args);
  }
  delete thisArgs.func;
  return result;
}

const curry = (fn, ...args) => {
  return args.length < fn.length ? 
    () => curry(fn, ...args, ...arguments)
    : fn(...args);
}

function getPersonInfo(one, two, three) {
  console.log(one);
  console.log(two);
  console.log(three);
}

const person = "Lydia";
const age = 21;

getPersonInfo`aa ${person} is ${age} years old`;
// getPersonInfo 必须是函数
// 如果使用标记的模板字符串，则第一个参数的值始终是字符串值的数组。
//  其余参数获取传递到模板字符串中的表达式的值！

// 使用“use strict”，可以确保不会意外地声明全局变量

const obj = { a: "one", b: "two", a: "three" };
console.log(obj);

// js6个假值: null、undefined、"", NaN,0,false

// 实现累加效果; 
function reduce(callbackfn){
  const O = this;
  const len = O.length;
  if(typeof callbackfn !== 'function'){
    return new TypeError(`${callbackfn} is not function`);
  }
  if (len === 0 && arguments.length < 1) {
    throw new TypeError('Reduce of empty array with no initial value'); 
  }
  let k = 0;
  let accumulator = undefined;

  if(arguments.length > 1) {
    accumulator = arguments[1];
  } else {
    accumulator = O[k];
    k++;
  }

  while(k < len){
     kPresent = O.hasOwnProperty(k);
    if (kPresent) {
      const kValue = O[k];
      accumulator = callbackfn.apply(undefined, [accumulator, kValue, k, O]);
    }
    k++;
  }
  return accumulator;
}

// new
function New(){
  var obj = {};
  var Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var res = Constructor.apply(obj, arguments);
  return res !== null && typeof res === 'object' ? res : obj;
}

// 继承 红宝书 todo

// async/await实现
// 原理: 利用generator分割代码片段;然后我们使用一个函数让其自迭代
// 每一个yield 用 promise 包裹起来。执行下一步的时机由 promise 来控制

// async 标志为异步函数; 返回一个function, 
// function内部返回一个promise
function _asyncToGenerator(fn){
  return function(){
    var args = arguments;
    return new Promise((resolve, reject) => {
      var gen = fn.apply(this, args);
      function _next(value){
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err){
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
      }
      _next(undefined);
    });
  }
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg){
  try {
    var info = gen[key](arg)
    var value = info.value;
  } catch(err) {
    reject(err);
    return;
  }

  if(info.done){
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

const asyncFunc = _asyncToGenerator(function*() {
  const e = yield new Promise(resolve => {
    setTimeout(() => {
      resolve('e');
    }, 1000);
  });
  const a = yield Promise.resolve('a');
  const d = yield 'd';
  const b = yield Promise.resolve('b');
  const c = yield Promise.resolve('c');
  return [a, b, c, d, e];
});

asyncFunc().then(res => {
  console.log(res); // ['a', 'b', 'c', 'd', 'e']
});

// 数据
const data = {
  text: 'default'
};

const input = document.getElementById('input');
const span = document.getElementById('span');
Object.defineProperty(data, 'text', {
  set(newValue){
    input.value = newValue;
    span.innerHTML = newValue;
  }
});

input.addEventListener('keyup', function(e){
  data.text = e.target.value;
});

const handler = {
  set(target, key, value){
    target[key] = value;
    input.value = value;
    span.innerHTML = value;
    return value;
  }
};

const proxy = new Proxy(data, handler);

input.addEventListener('keyup', function(){
  proxy.text = e.target.value;
});

function instance_of(L, R){
  const O = R.prototype;
  L = L.__proto__;
  while(true){
    if(L === null) return false;
    if(L === O)return true;
    L = L.__proto__;
  }
}

Array.isArray = function(o){
  return Object.prototype.toString.call(o) === '[object Array]';
}

function debounce(func, wait) {
  let timeout;
  return function(){
    let context = this;
    let args = arguments;
    if(timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  }
}

function throttle(fn, delay){
  var prevTimeout = Date.now();
  return function(){
    var curTime = Date.now();
    if(curTime - prevTimeout > delay){
      fn.apply(this, arguments);
      prevTimeout = curTime;
    }
  }
}
