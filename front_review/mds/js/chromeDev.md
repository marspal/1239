##  chrome 调试技巧

> debug 函数

```js
  function test(){
    console.log('aaaa');
  } 
  debug(test);
  test();
```

> Dom断点

Elements -> Break on -> attributes modifications(属性修改)
                     -> node removal (节点删除)
可以定位到引起变化的地方的代码;

> Force state

Elements -> ForceState -> :hover,:active,:focus等状态;


> $0 当前选中的元素， 全局函数

在Elements 选中任意元素, $0代表该元素

> console.log: 添加样式
```js
console.log("%c留下了鳄鱼的眼泪","font-size:30px; color: green");
console.log("%c留下了鳄鱼的眼泪%c  ","font-size:30px; color: green", "background: url(imgurl); font-size: 40px;")
```

> 发现并定位代码的内存泄漏

Memory -> Profiles ->Heap snapshot -> Comparison 对比

[内存泄漏]("../images/内存泄漏")

> Chrome内置工具  两个调试函数: $ = document.querySelector

注意: $(".mover") 只能找到盘匹配返回的第一个, $$(".mover")找到所有

> node debug方式: 放弃刀耕火种
chrome 调试
node --inspect-brk node.js
进入chrome: 点击 Dev for node.js

> 点击一个元素, 获取下面所有代码执行过程

- 思路1: 定位该元素的事件处理函数,然后从该函数往后进行debug, 确定执行过程;
- 思路2: 找到该次点击所造成的影响(如删除元素,XHR)等,在造成影响的位置下断点,通过call stack查看执行过程;

思路1: Element -> Event Listeners -> click 定位到代码;
思路2: Element -> 右键break on -> node removal; 定位删除元素地方的代码; call stack 从下往上看执行过程

> 如何使用Chrome调试Webpack 程序
- 1. 在想要调试的代码位置使用debugger下断点
- 2. 定位webpack-dev-server的命名文件(在node_modules/bin/webapck-dev-server)
- 3. 使用node -inspect-brk 打开调试服务(node --inspect-brk webpak-dev-server)
- 4. 使用chrome dev-tool进行调试

> console.count 不知道单常用
统计调用的次数
```js
  for(let i = 0; i <100; ++i){
    console.count();
  }
  // console.count("app")
```

> chrome的控制台播放动画了

```js
  for(let i = 0; i < 1000; ++i){
    setTimeout(() => {
      console.log("%c  ", `
        font-size: 120px;
        background: url(http://localhost:8080/time.gif) no-repeat;
        padding-left: 500px;
        background-color: white;
        background-size: 60px;
        background-position: ${i/10}% ${Math.sin(i/5)/2*50 + 50}%
      `);
    }, i * 100);
   
  }

```

>  使用错误断点，让程序在错误处暂停

Sources -> Don't Pause on Exceptions -> Pause on caught exceptions

> Chrome 编辑器

Sources -> Filesystem -> Add folder to workspace 在

> 使用chrome格式化代码

Sources -> 花括号 格式化代码

> 拒绝写重复的代码，使用Snippets

Sources -> Snippets -> 写名字 -> ctr + p -> !罗列Snippets -> 执行

> 调试样式  解决刷新 修改的问题

Sources -> 

> 超实用的新功能，使用Chrome追踪请求发起者

NetWork -> Initiator -> 查看请求

> 前端性能分析并不难，学会使用这个工具，轻轻松松定位问题

ctr + p > show performance monitor

CPU usage: CPU占用率
JS heap size: js 占用内存的大小
DOM Nodes: Dom节点的个数 内存中存在的个数 window.e = document.createElement("div")
JS event Listeners: 事件的个数

> 获取元素绑定事件: getEventListeners(window)

> 用这个工具，动画轻轻松松定位原因

Performance -> Record -> Frames(动画) 20fps才会流畅

Main -> JS 干了啥

> 项目测试代码内存泄漏

[动画帧率]("./images/动画帧率.png")

> Chrome动画检查器，检查和修改你的CSS动画

ctr + p > show animations