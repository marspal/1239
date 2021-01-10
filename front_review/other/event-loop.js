const {readFile, readFileSync} = require("fs");
setImmediate(()=>console.log('[阶段3.immediate] immediate 回调1'));
setImmediate(()=>console.log('[阶段3.immediate] immediate 回调2'));
setImmediate(()=>console.log('[阶段3.immediate] immediate 回调3'));

Promise.resolve().then(()=>{
  console.log('[...带切入下一阶段] promise 回调1');
  setImmediate(()=>console.log('[阶段3.immediate] promise 回调1增加的 immediate回调3'));
});

readFile("./text.txt", 'utf-8', data =>{
  console.log('[阶段2...IO 回调] 读文件回调1');
  readFile("./3-2 web服务类 application.mp4", 'utf-8', data =>{
    console.log('[阶段2...IO 回调] 读文件回调2');
    setImmediate(()=>console.log('[阶段3.immediate] promise 读文件回调2增加的 immediate回调3'));
  });
  setImmediate(()=>console.log('[阶段3.immediate] promise 读文件回调1增加的 immediate回调4'));
});

setTimeout(()=>console.log('[阶段1.timer] 定时器 回调1'), 0);
setTimeout(()=>{
  console.log('[阶段2.timer] 定时器 回调2')
  process.nextTick(()=>{
    console.log('[...带切入下一阶段] 定时器回调2中的 nextTick 回调2')
  });
}, 0);
setTimeout(()=>console.log('[阶段1.timer] 定时器 回调3'), 0);
setTimeout(()=>console.log('[阶段1.timer] 定时器 回调4'), 0);

process.nextTick(()=>{
  console.log('[...带切入下一阶段] process.nextTick 回调1')
});
process.nextTick(()=>{
  console.log('[...带切入下一阶段] process.nextTick 回调2')
  process.nextTick(()=>{
    console.log('[...带切入下一阶段] process.nextTick 回调4')
  });
});
process.nextTick(()=>{
  console.log('[...带切入下一阶段] process.nextTick 回调3')
});


setImmediate(()=>console.log(1));
setTimeout(()=>console.log(2),1);
// setTimeout(()=>console.log(3),10);


