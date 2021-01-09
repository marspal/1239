const myTarget = {};
const proxy = new Proxy(myTarget, {
  set(){
    console.log('set(), 123');
    Reflect.set(...arguments);
  }
});

console.log(Reflect.set(proxy, 'foo', 'aaa'));
// const target = {};
// Object.defineProperty(target, 'foo', {
//   value: 'bar',
//   configurable: false,
//   writable: false
// });

// const handler = {
//   get(){
//     return 'qux'
//   }
// }

// const proxy = new Proxy(target, handler);
// console.log(proxy.foo);