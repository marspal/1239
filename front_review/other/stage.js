// const {readFile} = require("fs");
// const EventEmitter = require("events");

// class EE extends EventEmitter{}
// const yy = new EE();

// yy.on('event', () => {
//   console.log("出大事了");
// });
// const startTime = Date.now();
// setTimeout(()=>{console.log('0毫秒后执行到期的计时器回调');},0);
// setTimeout(()=>{
//   console.log(Date.now() - startTime, '==sss');
//   console.log('100毫秒后执行到期的计时器回调');},100);
// setTimeout(()=>{console.log('200毫秒后执行到期的计时器回调');},200);


// readFile("./3-2 web服务类 application.mp4", 'utf-8', data => {
//   const endTime = Date.now();
//   console.log(endTime - startTime, '==');
//   console.log("完成文件3 读操作回调");
// });


// readFile("./text.txt", 'utf-8', data => {
//   const endTime = Date.now();
//   console.log(endTime - startTime, '==');
//   console.log("完成文件2 读操作回调");
// });

// setImmediate(()=>{
//   console.log('immediate 立即回答');
// });

// process.nextTick(()=>{
//   console.log("process.nextTick 的回调");
// });

// Promise.resolve().then(()=>{
//   yy.emit("event");
//   process.nextTick(()=>{
//     console.log("process.nextTick 的第二次回调");
//   });
//   console.log("promise 第一次回调");
// }).then(()=>{
//   console.log("promise 第二次回调");
// });

class Parent {
}
Parent.age = "123";

class Child extends Parent {}

console.log(Child.age);