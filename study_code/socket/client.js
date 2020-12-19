const net = require('net');

const heartbeat = 'HEART_BEAT';

const client = new net.Socket();

client.connect(9000, '127.0.0.1', () => {});

client.on('data', chunk => {
  let content = chunk.toString();
  if (content === heartbeat) {
    console.log('收到心跳包:', content);
  } else {
    console.log('收到数据:', content);
  }
});

// 定时发送数据
setInterval(() => {
  console.log('发送数据', new Date().toUTCString());
  client.write(new Date().toUTCString());
}, 5000);

// 定义发送心跳包
setInterval(function(){
  client.write(heartbeat);
}, 10000);