function deepCopy(obj, hash = new WeakMap()){
  if(obj instanceof RegExp) return new RegExp(obj);
  if(obj instanceof Date) return new Date(obj);
  if(obj === null || typeof obj !== 'object'){
    return obj;
  }
  if(hash.get(obj)){
    return hash.get(obj)
  }
  var t = new obj.constructor();
  hash.set(obj, t);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      t[key] = deepCopy(obj[key], hash);
    }
  }
  return t;
}

Function.prototype.call = function(){
  const [thisArgs, ...args] = [...arguments];
  if(!thisArgs){
    thisArgs = typeof window === undefined ? global : window;
  }
  thisArgs.func = this;
  var result = thisArgs.func(...args);
  delete thisArgs.func;
  return result;
}

Function.prototype.apply = function(){
  let result;
  const [thisArgs, args] = [...arguments];
  if(!thisArgs){
    thisArgs = typeof window === 'undefined' ? global : window;
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
  args.length < fn.length
  ? (...arguments) => curry(fn, ...args, ...arguments)
  : fn(...args);
}

function getPersonInfo(one, two, three) {
  console.log(one);
  console.log(two);
  console.log(three);
}

const person = "Lydia";
const age = 21;

getPersonInfo`${person} is ${age} years old`;
// getPersonInfo 必须是函数
// 如果使用标记的模板字符串，则第一个参数的值始终是字符串值的数组。
//  其余参数获取传递到模板字符串中的表达式的值！

// 使用“use strict”，可以确保不会意外地声明全局变量

const obj = { a: "one", b: "two", a: "three" };
console.log(obj);

// js6个假值: null、undefined、"", NaN,0,false