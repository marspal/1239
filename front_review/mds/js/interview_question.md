## interview1:

> Q1: html5语义化标签

```
  HTML5的革新之一：语义化标签, header nav article section footer aside
  语义化的好处:
  1. 在没有css代码的情况下，也能很好的呈现内容结构、代码结构（让非技术员也能看懂代码）;
  2. 提高用户体验，比如：title，alt用于解释名词和图片信息;
  3. 利于SEO，语义化能和搜索引擎建立更好的联系, 优化搜索;
  4. 便于团队开发与维护，语义化更具有可读性;
```
```html
  <header>
    <hgroup>
      <h1>网站标题</h1>
      <h1>网站副标题</h1>
    </hgroup>
  </header>  
```

- video标签

```
autoplay controls height loop muted poster preload src width
```

> Q2: 页面渲染原理

- 前言: 浏览器内核: 浏览器核心程序(包括渲染引擎、JS引擎) 如webkit、Blink

- 页面加载过程
1. 浏览器根据 DNS 服务器得到域名的 IP 地址
2. 向这个 IP 的机器发送 HTTP 请求；
3. 服务器收到、处理并返回 HTTP 请求；
4. 浏览器得到返回内容

- 浏览器渲染过程

1. 文件解析(HTML/SVG/XHTML, CSS, JS)
  一是 HTML/SVG/XHTML，HTML 字符串描述了一个页面的结构，浏览器会把 HTML 结构字符串解析转换 DOM 树形结构。
  二是 CSS，解析 CSS 会产生 CSS 规则树，它和 DOM 结构比较像。
  三是 Javascript 脚本，等到 Javascript 脚本文件加载后， 通过 DOM API 和 CSSOM API 来操作 DOM Tree 和 CSS Rule Tree。

2. 解析完成后, 引擎通过DOM Tree和CSS Rule Tree来构造Rendering Tree

  1）. Rendering Tree 并不等同于 DOM 树，渲染树只会包括需要显示的节点和这些节点的样式信息。
  2）. CSS 的 Rule Tree 主要是为了完成匹配并把 CSS Rule 附加上 Rendering Tree 上的每个 Element（也就是每个 Frame）。
  3）. 计算每个 Frame 的位置，这又叫 layout 和 reflow 过程。

3. 最后通过调用系统Native GUI的API绘制

- 构建DOM
  字节数据-> 字符串-> token-> Node-> DOM

- 构建CSSOM
  字节数据-> 字符串-> token-> Node-> DOM

- 构建渲染树
  当我们生成 DOM 树和 CSSOM 树以后，就需要将这两棵树组合为渲染树。
  
- 布局与绘制

- 性能优化

- 总结
1. 构建 DOM -> 构建 CSSOM -> 构建渲染树 -> 布局 -> 绘制。
2. CSSOM 会阻塞渲染，只有当 CSSOM 构建完毕后才会进入下一个阶段构建渲染树。
3. 通常情况下 DOM 和 CSSOM 是并行构建的，但是当浏览器遇到一个不带 defer 或 async 属性的 script 标签时，DOM 构建将暂停，如果此时又恰巧浏览器尚未完成 CSSOM 的下载和构建，由于 JavaScript 可以修改 CSSOM，所以需要等 CSSOM 构建完毕后再执行 JS，最后才重新 DOM 构建。

> Q3: 回流和重绘

> Q4: 核模型

>Q5: React-router使用

> Q6: http 三次握手

客户端和服务端在进行发送请求和响应的过程中，需要创建TCP connection, 因为
http为应用层协议，不存在连接，只存在请求响应，请求响应是数据包, 所以数据包是在TCP连接的基础上发送和请求的，http 1.0 TCP conntection响应结束后关闭
http1.1 可以设置不关闭，TCP连接有三次握手开销; http2 TCP 上的http是可以并发的, 只需要一个TCP连接就可以

三次握手: 
client 创建一个要发送连接的请求的数据包 SYN(同步序列号) 创建连接的标志位 SYN=1，Seq=x; server 开启TCP socket端口，发回客户端 SYN=1;ACK=x+1;Seq=Y；服务端的Seq; 客户端接到数据后， 说明客户端允许建立连接；然后向服务端发送数据ACK=Y+1; Seq=ACK(服务端);

三次握手的目的:
- 防止开启无用的连接，网络有延时
<!-- client                         server -->

> Q6: Chrome Devtools 的用处

ctt+p 
1. performance monitor
2. FPS 选项
3. 截图单个元素：> screen 选择Capture node screenhot

DOM 断点调试

getEventListeners（object）


> Q7: 模块化

``简介:`` 模块的引入主要是解决命名冲突、代码复用、代码可读性、依耐性(命复读依); 分类: AMD、CMD、
CommonJS、ES6模块化

> 原始写法:
1. 一个函数就是一个模块
2. 一个对象就是一个模块
3. 立即执行函数就是一个模块

> AMD 异步模块定义 
并非原生js支持,RequireJS模块化推广的产物 AMD依赖于RequireJS
```js
// 基本用法:
//a.js
//define可以传入三个参数，分别是字符串-模块名、数组-依赖模块、函数-回调函数
define(function(){
  return 1;
})

// b.js
//数组中声明需要加载的模块，可以是模块名、js文件路径
require(['a'], function(a){
    console.log(a);// 1
});
```
特点: 对于依赖的模块，AMD推崇依赖前置，提前执行; 也就是说，在define方法里传入的依赖模块(数组)，会在一开始就下载并执行。


> CMD 通用模块定义
CMD是SeaJS在推广过程中生产的对模块定义的规范，在Web浏览器端的模块加载器中;
同AMD,CMD也有一个函数库SeaJS与RequireJS类似的功能
```js
define(function(require, exports, module) {
  var $ = require('jquery');

  exports.setColor = function() {
    $('body').css('color','#333');
  };
});

//b.js
//数组中声明需要加载的模块，可以是模块名、js文件路径
seajs.use(['a'], function(a) {
  $('#el').click(a.setColor);
});
```
对于依赖的模块，CMD推崇依赖就近，延迟执行。也就是说，只有到require时依赖模块才执行。
区别: AMD推崇依赖前置,CMD推崇就近依赖,只有用到再去require
> CommonJS (node)
四个变量: module、exports、require、global

- 模块的暴露方式:
1. module.exports = {};
2. exports.xxx =  "";

```js
var exports = {};
var module = {
    exports: exports
}
return module.exports
```
- 引用模块
对于模块的引用使用全局方法require()就可以了

- 模块标识符
模块标识符其实就是你在引入模块时调用require()函数的参数

```js
// 直接导入
const path = require('path');
// 相对路径
const m1 = require('./m1.js');
// 直接导入
const lodash = require('lodash');
```
三种模块
- 核心模块(Node.js自带的模块)
- 路径模块(相对或绝对定位开始的模块)
- 自定义模块(node_modules里的模块)

三种查找方式:
- 核心模块，直接跳过路径分析和文件定位
- 路径模块，直接得出相对路径就好了
- 自定义模块，先在当前目录的node_modules里找这个模块，如果没有，它会往上一级目录查找，查找上一级的node_modules，依次往上，直到根目录下都没有, 就抛出错误。
```js
// 路径分析
console.log(module.paths)
```

文件定位(require省略了后缀名)

在NodeJS中, 省略了扩展名的文件, 会依次补充上.js, .node, .json来尝试, 
如果传入的是一个目录, 那么NodeJS会把它当成一个包来看待, 会采用以下方式确定文件名;

第一步, 找出目录下的package.json, 用JSON.parse()解析出main字段
第二步, 如果main字段指定的文件还是省略了扩展, 那么会依次补充.js, .node, .json尝试.
第三部, 如果main字段制定的文件不存在, 或者根本就不存在package.json, 那么会默认加载这个目录下的index.js, index.node, index.json文件.

commonjs 特点:
- 所有代码都运行在模块作用域，不会污染全局作用域；
- 模块是同步加载的，即只有加载完成，才能执行后面的操作；
- 模块在首次执行后就会缓存，再次加载只返回缓存结果，如果想要再次执行，可清除缓存；
- CommonJS输出是值的拷贝(即，require返回的值是被输出的值的拷贝，模块内部的变化也不会影响这个值)

> ES6模块化
- 引入export、import用于解决js自身不具备功能的缺陷

CommonJS模块是运行时加载，ES6 Module是编译时输出接口；
CommonJS加载的是整个模块，将所有的接口全部加载进来，ES6 Module可以单独加载其中的某个接口；
CommonJS输出是值的拷贝，ES6 Module输出的是值的引用，被输出模块的内部的改变会影响引用的改变；
CommonJS this指向当前模块，ES6 Module this指向undefined;


> Q8 短轮询、长轮询与websocket

- 短轮询: http 短轮询是server收到请求不管是否有数据到达都直接响应http请求，服务端响应完成，
就会关闭这个TCP连接；如果浏览器收到的数据为空，则隔一段时间，浏览器又会发送相同的http请求到server以获取数据响应
缺点：消息交互的实时性较低（server端到浏览器端的数据反馈效率低）

```js
const xhr = new XMLHttpRequest();
const id = setInterval(() => {
  xhr.open('GET', 'http://127.0.0.1:3000/test?key=value');
  xhr.addEventListener('load', (e) => {
    if (xhr.status == 200) {
      // 处理数据
      console.log(xhr.response)
      // 如果不需要可以关闭
      clearInterval(id)
    }
  })
  xhr.open();
}, 1000);
```
- 长轮询
http 长轮询是server收到请求后如果有数据，立刻响应请求；如果没有数据就会停留一段时间，这段时间内，如果server请求的数据到达（如查询数据库或数据的逻辑处理完成），就会立刻响应；如果这段时间过后，还没有数据到达，则以空数据的形式响应http请求；若浏览器收到的数据为空，会再次发送同样的http请求到server

缺点: server 没有数据到达时，http连接会停留一段时间，这会造成服务器资源浪费

```js
function ajax() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://127.0.0.1:3000/test?key=value');
  xhr.addEventListener('load', (e) => {
    if (xhr.status == 200) {
      // 处理数据
      console.log(xhr.response)
      // 如果不需要可以关闭
      if (xhr.response != '') return
      ajax()
    }
  })
  xhr.send();
}
```

1. 相同点
- 当server的数据不可达时，基于http长轮询和短轮询的http请求，都会停留一段时间
- 都是用于实时从服务器获取数据更新

2. 不同点
- http长轮询是在服务器端的停留，而http短轮询是在浏览器端的停留
- 短轮询隔一段时间向服务器发起请求，不管服务器数据有没有变化都直接返回结果，长轮询则在服务器数据有发生变化的时候才返回结果，如果在一定时间没有变化那么将会超时自动关闭连接


> VO(Variable object):声明阶段; AO(Activation Object): 函数的执行阶段(分为定义阶段、执行阶段)

```js
function test(x) {
  var b = 20; // local variable of the function context
}

test(30)
  
alert(a) // undefined
alert(b) // "b" is not defined
alert(c) // "c" is not defined

var a = 10 // variable of the global context
c = 40
```
```js
  // 执行过程
  // Variable object of the global context
  VO(globalContext) = {
    a: undefined,
    test: <reference to FunctionDeclaration 'test'>
  }

  VO(test functionContext)={
    x: undefined,
    b: undefined
  }
```
解释引擎在声明阶段解析到 c = 40, 会认为是一个赋值语句,因此不会被挂载VO上; 当执行到alert(c)时, 解析引擎在VO(globalContext)找不到变量c的定义时;
自然抛出c is not defined; 当执行到 c = 40 这段代码的时候; VO 被语句执行复写了，这时候整体的 VO 就是变成下面这样了

```js
  VO(globalContext) = {
    a: undefined,
    c: 40,
    test: <reference to FunctionDeclaration 'test'>
  }

```
这样你就可以理解了吧，为什么 JS 的声明会被提前，为什么函数的声明会覆盖变量的声明，
为什么有些时候会抛出 XXX is not defined，其实本质就是他们被挂载到 VO 上的既定顺序不同，
或者说他们在执行时是否已经被挂在 VO 上的区别而已。

> 长连接与短连接

1. 短连接: 
- HTTP/1.0中默认使用短连接，也就是说，客户端和服务器每进行一次HTTP操作，就建立一次连接，任务结束就中断连接
- 当客户端浏览器访问的某个HTML或其他类型的Web页中包含有其他的Web资源（如JavaScript文件、图像文件、CSS文件等），
  每遇到这样一个Web资源，浏览器就会重新建立一个HTTP会话
- 短连接的操作步骤是：建立连接——数据传输——关闭连接...建立连接——数据传输——关闭连接
- 像WEB网站的http服务一般都用短连接，并发量大，但每个用户无需频繁操作情况下需用短连接

2. 长链接:
- 从HTTP/1.1起，默认使用长连接，用以保持连接特性。使用长连接的HTTP协议，
  会在响应头加入这行代码Connection:keep-alive
- 在使用长连接的情况下，当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，
  客户端再次访问这个服务器时，会继续使用这一条已经建立的连接
- keep-alive不会永久保持连接，它有一个保持时间，可以在不同的服务器软件（如Apache）中设定这个时间。
  实现长连接需要客户端和服务端都支持长连接;
- 长连接的操作步骤是：建立连接——数据传输...（保持连接）...数据传输——关闭连接
- 长连接多用于操作频繁，点对点的通讯，而且连接数不能太多情况

> 为什么需要Hook

- 解决Component非UI逻辑复用的问题

- 组件生命周期函数不适合side effect逻辑管理

- 不友好的class Component