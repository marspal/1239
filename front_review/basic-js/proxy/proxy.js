var obj = new Proxy({}, {
  get: function(target, propKey, receiver){
    console.log(`getting ${propKey}`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function(target, propKey, value, receiver){
    console.log(`setting ${JSON.stringify(receiver)}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});

// obj["aa"] = 1;
// obj.count = 1;
// ++obj.count;

Object.defineProperty(obj, "name", {
  value: '123',
  writable: false,
  enumerable: false,
  configurable: false
})
// console.log(obj.name);

// var proxy = new Proxy(target, handler);

var proxy = new Proxy({}, {
  get: function(target, propKey){
    return 35;
  }
});

// console.log(proxy.name);

var target = {};
var handler = {};
var proxy = new Proxy(target, handler);
proxy.a = "b";
// console.log(target === proxy);

var proxy = new Proxy({'a': 123}, {
  get: function(target, proxy){
    return 35;
  }
});

var obj = Object.create(proxy);
// console.log(obj.a);

var handler = {
  get: function(target, name){
    if(name === 'prototype'){
      return Object.prototype;
    }
    return 'Hello,' + name;
  },
  apply: function(target, thisBinding, args){
    return args[0];
  },
  construct: function(target, args){
    return {value: args[1]}
  }
};

var fProxy = new Proxy(function(x,y){
  return x + y;
}, handler);
// console.log(fProxy(1,2));
// console.log(new fProxy(1,2));
// console.log(fProxy.prototype === Object.prototype);
// console.log(fProxy.foo === "Hello,foo");

var person = {
  name: "张三"
}

var proxy = new Proxy(person, {
  get: function(target, propKey){
    if(propKey in target){
      return target[propKey]
    }else{
      throw new ReferenceError("Prop name \"" + propKey + "\" does not exist.");
    }
  }
});
// console.log(proxy.name);
// proxy.a

let proto = new Proxy({}, {
  get(target, propKey, receiver){
    console.log("GET "+ propKey);
    return target[propKey]
  }
});

var obj = Object.create(proto);
// obj.foo;

function createArray(...elements){
  let handler = {
    get(target, propKey, receiver){
      let index = Number(propKey);
      if(index < 0){
        propKey = String(index + target.length);
      }
      return target[propKey]
    }
  };
  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}

var arr = createArray("a", "b", "c");
// console.log(arr[-11]);

function pipe (value){
  let funStack = [];
  let proxy = new Proxy({}, {
    get(target, propKey, receiver){
      if(propKey === 'get'){
        return funStack.reduce((val, fn) => {
          return fn(val);
        }, value);
      }
      funStack.push(global[propKey]);
      return receiver;
    }
  });
  return proxy;
}

global.double = n => n * 2;
global.pow = n => n * n;
global.reverseInt = n => n.toString().split("").reverse().join("") | 0;
console.log(pipe(3).double.pow.reverseInt.get)
