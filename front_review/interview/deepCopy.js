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