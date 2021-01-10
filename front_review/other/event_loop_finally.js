// setTimeout(()=> {
//   console.log(1)
//   // Promise.resolve(3).then(data => console.log(data))
//   process.nextTick(()=>{
//     console.log(3);
//   });
// }, 0)
// setTimeout(()=> {
//   console.log(2)
// }, 0);

// process.nextTick(()=>{
//   console.log("12312");
// });
// console.log("asd");

// Promise.resolve('123').then(res=>{  console.log(res)})
// process.nextTick(() => console.log('nextTick'))

// setTimeout(() => {
//   console.log('setTimeout')
// }, 0)

// setImmediate(() => {
//   console.log('setImmediate')
// })

// var start = Date.now()
// while (Date.now() - start < 2);


// Promise.resolve().then(() => console.log('promise resolve'))

// console.log("asd");

// new Promise((resolve, reject) => {
//   console.log("promise1");
//   resolve();
// }).then(() => {
//     console.log("then11");
//     new Promise((resolve, reject) => {
//       console.log("promise2");
//       resolve();
//     }).then(() => {
//         console.log("then21");
//     }).then(() => {
//         console.log("then22");
//     }).then(() => {
//       console.log("then23");
//   });;
// }).then(() => {
//     console.log("then12");
// }).then(() => {
//   console.log("then13");
// });

// promise1 then11 promise2 then21 then12 then22 
// promise1 then11 promise2 then21 then12 then22 then13 then23

async1()
console.log('main1')
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2')
}
console.log('main2')

// 'async1 start' async2  main1  main2  'async1 end'