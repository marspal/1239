## 洋葱模型


![Request Response]("../images/requestResponse.png");
![middleware]("../images/middleware.png");

洋葱模型很形象的说了compose中间件原理; 每一个中间件都保留着对下一个中间件的引用;
通过dispatch函数不断地触发中间件调用;

```js
    const Koa = require('koa');
    const app = new Koa();

    app.use(async (ctx, next) => {
        console.log(1);
        await next();
        console.log(1);
    });
    app.use(async (ctx, next) => {
        console.log(2);
        await next();
        console.log(2);
    });
    app.use(async (ctx, next) => {
        console.log(3);
        await next();
        console.log(4);
    });
```
使用compose后; 返回一个如下函数, 通过执行这个函数去执行第一个中间件; 在第一个中间内可以去执行第二个中间件; 这就用到系统栈的调用: 先把A压入stack,在A中执行B,B压入系统栈, 重复次过程, 直到压入D; D执行完后, 出栈继续执行C剩余的代码; 直到A执行完成   
[A, B, C, D] 整个过程如下:A -> B -> C -> D -> C -> B -> A;
```js
function next(ctx, next) {

}
```
