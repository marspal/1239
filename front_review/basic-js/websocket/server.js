const ws = require("ws");

const wss = new ws.Server({
  port: 3000
});
const sockets = new Set();
// 服务器被客户端连接
wss.on("connection", (ws) => {
  sockets.add(ws);
  // console.log(sockets.size)
  ws.send(JSON.stringify({type: 'connected'}));
  // 通过 ws 对象，就可以获取到客户端发送过来的信息和主动推送信息给客户端
  var i = 0;
  var int = setInterval(function f(){
    ws.send(i++);
  }, 1000);
  ws.on('message', (message) => {
    console.log(message);
  })
  ws.on("close", () => {
    console.log("--close--");
    sockets.delete(ws);
  });
});