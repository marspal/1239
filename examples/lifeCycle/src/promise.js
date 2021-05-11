function _asyncToGenerator(fn){
    return function(){
        return new Promise((resolve, reject) => {
            var gen = fn.apply(this, arguments);

            function _next(value){
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
            }
            function _throw(err){
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
            }
            _next();
        })
    }
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg){
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch(err => {
        reject(err);
        return;
    });
    if(info.done){
        // 迭代器完成
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}

// generator 一次只生

function * generateSequence() {
    yield 1;
    yield new Promise(resolve => setTimeout(() => resolve(5), 5000)).then(val => val);
    return 4
}
let generator = generateSequence();
for(let value of generator) {
    console.log(value); // 1，然后是 2
}

function* gen() {
    // 向外部代码传递一个问题并等待答案
    let result = yield "2 + 2 = ?"; // (*)

    console.log(result);
    return 12;
}

let generator = gen();

let question = generator.next(4).value; 
console.log(question);
setTimeout(() => generator.next(4), 1000);

function* gen() {
    let ask1 = yield "2 + 2 = ?";

    console.log(ask1, 'ask1'); // 4

    let ask2 = yield "3 * 3 = ?"

    console.log(ask2); // 9
}

let generator = gen();
let res = generator.next().value;
console.log( res ); // "2 + 2 = ?"

console.log( generator.next(res).value ); // "3 * 3 = ?"

console.log( generator.next(9).done ); // true
  

function* gen() {
    try {
      let result = yield "2 + 2 = ?"; // (1)
        console.log(result, '=-===');
      console.log("The execution does not reach here, because the exception is thrown above");
    } catch(e) {
      console.log(e, 'asdasd'); // 显示这个 error
    }
  }
  
  let generator = gen();
  
  let question = generator.next().value;
  console.log(question, '===');
  generator.throw(new Error("The answer is not found in my database"));