// 防抖函数: 值执行最后一次
const debounce = function(fn, delay){
  let timer = null;
  return function(...args){
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay);
  }
}

// 节流
const throttle = function(fn, ms){
  let timer = null;
  return function(...args){
    if(timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      clearTimeout(timer);
    }, ms);
  }
}

// promisifiy
function promisifiy(fn, ...args){
  return function(){
    args.concat(Array.from(arguments));
    return new Promise((resolve, reject) => {
      args.push(function(err, data) {
        if(err)reject(err);
        resolve(data);
      });
      fn.apply(null, args)
    });
  }
}


/**
 * 深拷贝 
 */

/**
 * 简单版 局限性
 * 1. 他无法实现对函数、RegExp等特殊对象的克隆
 * 2. 会抛弃对象的constructor,所有的构造函数会指向Object
 * 3. 对象有循环引用,会报错
 */
const newObj = JSON.parse(JSON.stringify({}));

function isObj(obj){
  return typeof obj === 'object' && obj !== null;
}

function cloneDeep(source, hash = new WeakMap()){
  let cloneObj;
  let Constructor = source.Constructor;
  switch(Constructor){
    case RegExp:
      cloneObj = new Constructor(source);
      break;
    case Date:
      cloneObj = new Date(source.getTime());
      break;
    default:
      if(hash.has(source))return hash.get(source);
      cloneObj = new Constructor();
      hash.set(source, cloneObj);
  }
  for(let key in source){
    if(Object.prototype.hasOwnProperty.call(source, key)){
      cloneObj[key] = isObj(source[key]) ? cloneObj(source[key], hash) : source[key];
    }
  }
  return cloneObj;
}

// Event Bus
class EventEmitter{
  constructor(){
    this._events = this._events || new WeakMap();
    this._maxListeners = this._maxListeners || 10;
  }
  addListener(type, fn){
    if(!this._events.get(type)){
      this._events.set(type, fn)
    }
  }
  emit(type, ...args){
    let handler = this._events.get(type);
    handler.apply(this, args);
    return true;
  }
  addListener2(type, fn){
    let handlers = this._events.get(type) || [];
    handlers.push(fn);
    this._events.set(type, result);
  }
  emit2(type, ...args){
    let fns = this._events.get(type) || [];
    fns.forEach(fn => fn(...args))
    return true;
  }
  removeListener(type, fn){
    let fns = this._events.get(type) || [];
    if(fns.length){
      this._events.set(type, fns.filter(item => item === fn));
    }
  }
}

// L instanceof R
function instance_of(L, R){
  const O = R.prototype;
  L = L.__proto__;
  while (true) {
    if(L === null) return false;
    if(L === O) return true;
  }
}
function instance_of(L, R){
  const O = R.prototype;
  L = L.__proto__;
  while(true){
    if(L === null) return false;
    if(L === O) return true;
    L = L.__proto__;
  }
}

// new 
function ObjectFactory(){
  const obj = {};
  const Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  const result = Constructor.apply(obj, arguments);
  return typeof ret === 'object'? result : obj;
}

function New(Fn){
  const obj = {};
  obj.__proto__ = Fn.prototype;
  const ret = Fn.apply(obj, arguments);
  return typeof ret === 'object'? ret: obj;
}

// call
Function.prototype.myCall=function(content){
  content = content || window;
  context.fn = this;
  var args = [];
  for(let i = 1; i < arguments.length; ++i){
    args.push('arguments['+i+']');
  }
  // let result = content.fn(...args); es6写法
  var result = eval('context.fn('+args+')'); // 这里 args 会自动调用 Array.toString() 这个方法。 
  delete context.fn;
  return result;
}

Function.prototype.myApply = function(context, args){
  context = context || window;
  context.fn = this;
  var result;
  if(!args){
    result = context.fn();
  }else{
    let arg =  [];
    for(var i = 0; i < arg.length; ++i){
      args.push('arg['+i+']');
    }
    result = eval('content.fn('+args+')');
  }
  delete context.fn;
  return result;
}


// 有参数
Function.prototype.bind = function(context){
  let self = this,
      args = [].slice.call(arguments, 1);
  return function(){
    self.apply(context, args.concat([].slice.call(arguments)))
  }
}

// 作为构造函数使用时, 忽略要绑定的this
/**
 * 对于 var gioia = new Person() 来说
 * 使用 new 时，this 会指向 gioia，
 * 并且 gioia 是 Person 的实例。 
 * 因此，如果 this instance Person，就说明是 new 调用的
 * 
 */
Function.prototype.bind = function(context){
  let self = this;
  let args = [].slice.call(arguments, 1);
  function Bound(){
    var boundArgs = [].slice.call(arguments);
    return self.apply(this instanceof Bound ? this: context, boundArgs.concat(args));
  }
  Bound.prototype = this.prototype;
  return Bound;
}

// Object.create
function create(obj){
  function F(){};
  F.prototype = obj;
  return new F();
}


// 解析 URL Params 为对象
// protocol://auth@host/path#hash

/**
 * auth: user:password
 * host: hostname + port
 * path: pathname + search
 * search: ? + query
 * hash: #hash 
 */

// 模板实现

function render(template, data) {
  const reg = /\{\{(\w+)\}\}/; // 模板字符串正则
  if (reg.test(template)) { // 判断模板里是否有模板字符串
    const name = reg.exec(template)[1]; // 查找当前模板里第一个模板字符串的字段
    template = template.replace(reg, data[name]); // 将第一个模板字符串渲染
    return render(template, data); // 递归的渲染并返回渲染后的结构
  }
  return template; // 如果模板没有模板字符串直接返回
}

// 转化为驼峰命名
// \w 匹配数字、字母、下划线
var f = function(s){
  return s.replace(/-\w/g, function(x){
    return 
  });
}
// curry
var curry = function(fn){
  var args = [].slice.call(arguments, 1);
  return function(){
    var newArgs = args.concat([].slice.call(arguments));
    fn.apply(this, newArgs);
  }
}
// 使用
function add(a, b){
  return a + b;
}
var addCurry = curry(add, 1, 2);
addCurry();
var addCurry = curry(add, 1);
addCurry(2);
var addCurry = curry(add);
addCurry(1,2);

function curry(fn){
  length = fn.length;
  var args = [];
  return function(){
    if(args.length >= length){
      return fn.apply(this, arguments);
    } 
    args.concat(Array.from(arguments))
  }
}

const Class = (function(){
  function Constructor(name){
    this.name = name;
  }
  Constructor.name = "123";
  Constructor.getName = function(){};
  Constructor.prototype.age = '123';
  Constructor.prototype.getAge = {};
  return Constructor;
})()
// class实现
const Class = (function(){
  function Constructor(name){
    this.name = name;
  }
  // 添加原型方法
  Constructor.prototype.getName= function(){}
  // 添加原型属性
  Constructor.prototype.age = "";
  // 添加静态方法
  Constructor.log = function(){};
  // 添加静态属性
  Constructor.isWho = ""
  return Constructor;
})();
// extends

const Parent = (function(){
  function Constructor(age){
    this.age = age;
  }
  Constructor.prototype.getName = function(){}
  return Constructor;
})();

// 子类
const Class = (function(_Parent = null){
  function Constructor(name, age){
    // _Parent? Parent.call(this, name) : this;
    if(_Parent){
      Parent.call(this, name)
    }
    this.age = age;
  }
  if(_Parent){
    Constructor.prototype = Object.create(_Parent.prototype, {
      constructor: {
        value: Constructor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    Constructor.__proto__ = _Parent;
  }
  Constructor.prototype.getAge = {}
  return Constructor;
})(Parent);

// 先看集成