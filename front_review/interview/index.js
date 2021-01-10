function isObj(obj){
  return (typeof obj === 'object' || typeof obj === 'function') && obj
}
function cloneDeep(source){
  var result = Array.isArray(source)? [] : {};
  for(let key in source){
    if(Object.prototype.hasOwnProperty.call(source, key)){
      result[key] = isObj(source[key]) ? cloneDeep(source[key]) : source[key];
    }
  }
  return result;
}

const obj = {
      arr: [111, 222],
      obj: {key: '对象'},
      a: () => {console.log('函数')},
      date: new Date(),
      reg: /正则/ig
}
var b = cloneDeep(obj);
console.log(b);
