// setImmediate(()=>{
//   console.log("setImmediate1");
//   setImmediate(()=>{
//     console.log("setImmediate4");
//   });
// });
// setImmediate(()=>{
//   console.log("setImmediate2");
// });
// setImmediate(()=>{
//   console.log("setImmediate3");
// });
// setTimeout(() => {
//   console.log("setTimeout1");
//   setTimeout(() => {
//     console.log("setTimeout2");
//     setTimeout(() => {
//       console.log("setTimeout4");
//     }, 0)
//   }, 0)
//   setTimeout(() => {
//     console.log("setTimeout3");
//   }, 0)
// }, 0)
// setTimeout(()=>{
//   console.log("setTimeout5");
// });
// process.nextTick(()=>{
//   console.log("nextTick1");
//   process.nextTick(()=>{
//     console.log("nextTick2");
//     process.nextTick(()=>{
//       console.log("nextTick3");
//     });
//   });
// });
// Promise.resolve().then(()=>{
//   console.log("promise1");
//   Promise.resolve().then(()=>{
//     console.log("promise2");
//     Promise.resolve().then(()=>{
//       console.log("promise3");
//     });
//   });
// });
// console.log("123123");

// console.time("start")

// setTimeout(function () {
//     console.log(2);
// }, 10);
// setImmediate(function () {
//     console.log(1);
// });

// new Promise(function (resolve) {
//     console.log(3);
//     resolve();
//     console.log(4);
// }).then(function () {
//     console.log(5);
//     console.timeEnd("start")
// });
// console.log(6); // 6
// process.nextTick(function () {
//     console.log(7);
// });
// console.log(8); // 3 4 6 8 7 5 start: ms 1 2

setTimeout(() => console.log('timeout1'));
setTimeout(() => {
    console.log('timeout2')
    Promise.resolve().then(() => console.log('promise resolve'))
    process.nextTick(() => console.log('aaaaaaaa'));
});
setTimeout(() => console.log('timeout3'));
setTimeout(() => console.log('timeout4'));
process.nextTick(() => console.log('processNextTick'));
setImmediate(()=> console.log("setImmediate"));


// setImmediate(()=>{
//   console.log("setImmediate1");
//   Promise.resolve().then(()=>{
//     console.log("setImmediate2");
//   });
// });
// setImmediate(()=>{
//   console.log("setImmediate21");
//   Promise.resolve().then(()=>{
//     console.log("setImmediate22");
//   });
// });
// setImmediate(()=>{
//   console.log("setImmediate31");
//   Promise.resolve().then(()=>{
//     console.log("setImmediate32");
//   });
// });

// timers 、pending callback 、idle/prepare、poll、check、closing callbacks