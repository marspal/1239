# websocket

简单使用:

> client

```html
  <script>
    const ws = new WebSocket('ws:localhost:3000');
    // 接受
    ws.onmessage = ({data}) => {
      console.log(data);
      if(data == 10){
        ws.send("close");
        ws.close();
      }
    };

    // 发送message
    ws.onopen = function(){
      ws.send("hello");
    }
  </script>
```

```js
const ws = require('ws');
const wss = new ws("ws://localhost:3000");
wss.on("message", (message) => {
  console.log(message);
  if(message == 10){
    // ws.send("close");
    // ws.CLOSED()
    wss.send("close");
    wss.close();
  }
});
```

> server

```js
const ws = require("ws");

const wss = new ws.Server({
  port: 3000
});
// 服务器被客户端连接
wss.on("connection", (ws) => {
  // 通过 ws 对象，就可以获取到客户端发送过来的信息和主动推送信息给客户端
  var i = 0;
  var int = setInterval(function f(){
    ws.send(i++);
  }, 1000);
  ws.on('message', (message) => {
    console.log(message);
  })
});
```

