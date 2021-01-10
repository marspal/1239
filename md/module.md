## module (模块化)

``ES6:`` 核心思想静态化, 编译时就能确定模块的依赖关系、以及输入、输出变量; CommonJS、AMD只能运行时确定这些东西;

export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。

> as 重命名

import命令输入的变量都是只读的,因为它的本质是输入接口; 也就是说,不允许在加载模块的脚本里面改写接口。

由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

import 'lodash': 代码仅仅执行所加载的模块,但是不输入任何值。
如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次。

```js
import { foo } from 'my_module';
import { bar } from 'my_module';

// 等同于
import { foo, bar } from 'my_module';
```
import语句是 Singleton 模式。

整体加载: * 

export default 命令

```js
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';
```

export 与 import 的复合写法

```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```
注: foo和bar实际上并没有被导入当前模块,只是相当于对外转发了这两个接口，导致当前模块不能直接使用foo和bar。

```js
// 接口改名
export { foo as myFoo } from 'my_module';
// 整体输出
export * from 'my_module';
// 默认接口
export { default } from 'foo';

// 等价
export { es6 as default } from './someModule';
import { es6 } from './someModule';
export default es6;

export { default as es6 } from './someModule';

// 等同于
export * as ns from "mod";
import * as ns from "mod";
export {ns};
```

```js
export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}
```
上面代码中的export *，表示再输出circle模块的所有属性和方法; 忽略circle模块的
defaultf方法

场景:
（1）按需加载。
```js
button.addEventListener('click', event => {
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  })
  .catch(error => {
    /* Error handling */
  })
});
```
（2）条件加载
```js
if (condition) {
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}
```

（3）动态的模块路径
```js
import(f())
.then(...);
```

注意: import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。
import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。