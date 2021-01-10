# node模块学习

## 模块学习
### fs 模块

> fs.watch: fs.watch(filename[, options][, listener])

[地址](http://nodejs.cn/api/fs.html#fs_fs_watch_filename_options_listener)
```js
const fs = require('fs');
fs.watch('./test', function (event, filename) {
  console.log('event is: ' + event);
  if (filename) {
    console.log('filename provided: ' + filename);
  } else {
    console.log('filename not provided');
  }
});
```

> 扩展1: chokidar 监听文件的变化 依赖fs module

> 扩展2: serve-handler: This package represents the core of serve. 

  It can be plugged into any HTTP server and is responsible for routing requests and handling responses.


### url 模块

> 前言:

组成: protocol://auth@host/path#hash   https://user:pass@www.baidu.com/p/a/t/h?query=string#hash

> url.parse(urlString) The url.parse() method takes a URL string, parses it, and returns a URL object.


### ws package


### process(进程)

process.cwd(): 方法返回 Node.js 进程的当前工作目录


### path

path.relative(): 方法根据当前工作目录返回 from 到 to 的相对路径



## 源码解析区域

### 文件异步io到线程池

- 文件异步io操作通过封装后把请求提交给线程池
- 线程池的原理,相关的系统支持(互斥锁、条件变量)
- 线程池完成io操作后,告知主线程/事件循环的方式 --- 线程池统一的io观察者、及相关的系统支持【管道、事件对象】
- 主线程epoll_wait收到线程池的通知后，回调到文件异步io操作的callback的过程

```js
// 实例
fs.write("xxx", function(err, data){});
```
node 架构图: standard lib -> c++模块 -> 底层(V8、libuv、C-ares)

> 从文件异步io操作到封装请求交给线程池的过程

js代码到libuv的函数, 经历了几个层次(原生js lib模块 -> node c++ 模块 -> libuv 模块)

- libuv 的文件io请求对象 -- uv_fs_t

<p>
  <image src="../images/fs_readfile.jpg"/>
</p>

可以看到一次异步文件读操作在libuv层被封装到一个uv_fs_t的结构体，req->cb是来自上层的回调函数;
异步io请求最后调用uv__work_submit，把异步io请求提交给线程池。

uv__fs_work：这个是文件io的处理函数，可以看到当cb为NULL的时候，即非异步模式，uv__fs_work在当前线程（事件循环所在线程）直接被调用。
如果cb != NULL，即文件io为异步模式，此时把uv__fs_work和uv__fs_done提交给线程池。

uv__fs_done：这个是异步文件io结束后的回调函数。在uv__fs_done里面会回调上层C++模块的cb函数（即req->cb）。

> 线程池的原理
- 条件变量与互斥锁的基础

1. 互斥锁 —— pthread_mutex_t mutex
2. 系统通过pthread_mutex_t结构、及相关的pthread_mutex_lock()、pthread_mutex_unlock()来对共享资源的请求进行加锁、解锁

- 原理:

> 线程池统一的io观察者 —— 管道、事件对象

管道、事件对象都是系统提供的机制，都可以用于线程间发送数据，所以这里可以用于线程间的通知

> 

```js
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

```