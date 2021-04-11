const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise{
  constructor(executor){
    this.status = "pending";
    this.value = undefined;
    this.reason = undefined
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if(status === PENDING){
        this.status = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    };
    const reject = (reason) => {
      if(status === PENDING){
        this.status = REJECTED;
        this.reason = reason;
        
      }
    };
    try {
      executor(resolve, reject);
    } catch(err){
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : (err) => {throw err};
    let p2 = new Promise((resolve, reject) => {
      if(this.status === FULFILLED){
        queueMicrotask(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(p2, x, resolve, reject);
          }catch(err){
            reject(err);
          }
        });
      }
      if(this.status === REJECTED){
        queueMicrotask(() => {
          try{
            let x = onRejected(this.reason);
            resolvePromise(p2, x, resolve, reject);
          }catch(err){
            reject(err);
          }
        });
      }
      if(this.status === PENDING){
        this.onResolvedCallbacks.push(() => {
          queueMicrotask(() => {
            try{
              let x = onRejected(this.reason);
              resolvePromise(p2, x, resolve, reject);
            }catch(err){
              reject(err);
            }
          });
         
        });
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try{
              let x = onRejected(this.reason);
              resolvePromise(p2, x, resolve, reject);
            }catch(err){
              reject(err);
            }
          });
        });
      }
    });
    return p2;
  }
  catch(fn){
    this.then(null, fn)
  }

}

function resolvePromise(p2, x, resolve, reject) {
  if(x === p2){
    return reject(new TypeError('chaning'));
  }

  let called;
  if(x !== null && (typeof x === 'object' ||typeof x === 'function')){
    try{
      let then = x.then;
      if(typeof then === 'function'){
        then.call(x, y => {
          if(called)return;
          called = true;
          resolvePromise(p2, y, resolve, reject);
        }, err => {
          if(called) return;
          called = true;
          reject(err);
        });
      } else {
        resolve(x);
      }
    }catch(err){
      if(called)return;
      called = true;
      reject(err);
    }
  } else {
    resolve(x);
  }
}

function _asyncToGenerator(fn){
  return function(){
    let self = this, args = arguments;
    return new Promise((resolve, reject) => {
      var gen = fn.apply(self, args);
      
      function _next(value){
        asyncStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err){
        asyncStep(gen, resolve, reject, _next, _throw, 'throw', value);
      }
      _next();
    });
  }
}

function asyncStep(gen, resolve, reject, _next, _throw, key, args){
  try {
    var info = gen[key](args);
    var value = info.value;
  }catch(err){
    reject(err);
    return;
  }
  if(info.done){
    resolve(value);
  } else{
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

function instance_of(L, R){
  let O = R.prototype;
  let L = L.__proto__;

  while(true){
    if(L === null) return false;
    if(L === O) return true;
    L = L.__proto__;
  }
}

if(typeof Object.getOwnPropertyNames !== 'function'){
  Object.getOwnPropertyNames = function(o){
    if(o !== Object(o)){
      return TypeError('Object.getOwnPropertyNames called on non-object');
    }
    var props = [], p;

    for(p in o){
      if(Object.prototype.hasOwnProperty.call(o, p)){
        props.push(p);
      }
    }
    return props;
  }
}

if(typeof Object.create === 'function'){
  Object.create = function(prototype, properties){
    if(typeof prototype === 'object') throw TypeError();
    function Ctor(){
    }
    Ctor.prototype = prototype;
    var o = new Ctor();
    if(prototype)o.contructor = Ctor;
    if(properties != null){
      Object.defineProperties(o, properties);
    }
    return o;
  }
}