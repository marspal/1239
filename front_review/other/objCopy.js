function cloneShallow(source){
  var target = {};
  for(var key in source){
    if(Object.prototype.toString.call(source, key)){
      if(typeof source[key] == 'object'){
        target[key] = cloneShallow(source[key]);
      }else{
        target[key] = source[key];
      }
    }
  }
  return target;
}

/**
 * 问题:
 * 1. 没有对传入的参数校验、传入null 返回 {}
 * 2. 没有考虑数组的兼容
 */

 function isObject(source){
   return typeof source == 'object' && source != null;
 }

 function cloneDeep(source){
  if(!isObject(source)) return source;
  var target = Array.isArray(source)? [] : {};
  for(var key in source){
    if(Object.prototype.toString.call(source, key)){
      if(typeof source[key] == 'object'){
        target[key] = cloneShallow(source[key]);
      }else{
        target[key] = source[key];
      }
    }
  }
  return target;
}

/*
* 解决循环引用问题
* hash
*/

function cloneDeepWithHash(source, hash = new WeakMap()){
  if(!isObject(source)) return source;
  if(hash.get(source)) return hash.get(source);
  var target = Array.isArray(source)? [] : {};
  hash.set(source, target);
  for(var key in source){
    if(Object.prototype.toString.call(source, key)){
      if(typeof source[key] == 'object'){
        target[key] = cloneDeepWithHash(source[key], hash);
      }else{
        target[key] = source[key];
      }
    }
  }
  return target;
}


function find(err, key){
  for(var i = 0; i < Array.length; ++i){
    if(arr[i].source === key){
      return arr[i].target
    }
  }
  return null;
}
function copyDeepWithLinkedList(source, linkedList){
  if(isObject(source)) return source;
  // 初始化linkedList
  if(!linkedList) linkedList = [];
  var uniqueData = find(linkedList, source);
  if(uniqueData){
    return uniqueData;
  }
  var target = Array.isArray(source)? [] : {};
  linkedList.push({
    source: source,
    target: target
  });

  for(var key in source){
    if(Object.prototype.toString.call(source, key)){
      if(typeof source[key] == 'object'){
        target[key] = copyDeepWithLinkedList(source[key], linkedList);
      }else{
        target[key] = source[key];
      }
    }
  }
  return target;
}


/**
 * 拷贝 Symbol
 * - Object.getOwnPropertySymbols(...)
 * - Reflect.ownKeys()
 **/ 

 function copyDeepIncludeSymbolsWithHash(source, hash = new WeakMap()){
  if(!isObject(source)) return source;
  if(hash.get(source)) return hash.get(source);
  let target = Array.isArray(source)? [] : {};
  hash.set(source, target);

  let symKeys = Object.getOwnPropertySymbols(source);
  if(symKeys.length){
    symKeys.forEach(symKey => {
      if (isObject(source[symKey])) {
        target[symKey] = copyDeepIncludeSymbolsWithHash(source[symKey], hash); 
      } else {
          target[symKey] = source[symKey];
      }  
    });
  }
  for(let key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep4(source[key], hash); 
      } else {
        target[key] = source[key];
      }
    } 
  }
  return target;
 }

 function copyDeepIncludeSymbolsWithHash2(source, hash = new WeakMap()) {
  if (!isObject(source)) return source; 
  if (hash.has(source)) return hash.get(source); 
    
  let target = Array.isArray(source) ? [] : {};
  hash.set(source, target);
  
  Reflect.ownKeys(source).forEach(key => { // 改动
    if (isObject(source[key])) {
      target[key] = copyDeepIncludeSymbolsWithHash2(source[key], hash); 
    } else {
      target[key] = source[key];
    }  
  });
  return target;
}


