const net = require('net');

const clientList = [];
const heartbeat = 'HEART_BEAT';
const server = net.createServer();

server.on('connection', (client) => {
  console.log('客户端建立链接:', client.remoteAddress + ':' + client.remotePort);
  clientList.push(client);
  client.on('data', (chunk) => {
    let content = chunk.toString();
    if (content === heartbeat) {
      console.log('收到客户端发过来的一个心跳包');
    } else {
      console.log('收到客户端发送过来的数据', content);
      client.write('服务端的数据:'+ content);
    }
  });
  client.on('end', () => {
    console.log('收到客户端的end');
    clientList.splice(clientList.indexOf(client), 1);
  });
  client.on('error', () => {
    clientList.splice(clientList.indexOf(client), 1);
  });
});

server.listen(9000);

setInterval(broadcast, 10000);

function broadcast(){
  console.log('broadcast heartbeat', clientList.length);
  let cleanup = [];
  for (let i = 0; i < clientList.length; i++) {
    if(clientList[i].writable){
      clientList[i].write(heartbeat);
    }else{
      console.log('一个无效的客户端');
      cleanup.push(clientList[i]);
      clientList[i].destroy();
    }
  }
  // Remove dead Nodes
  for(let i = 0; i < cleanup.length; ++i){
    console.log('删除无效的客户端:', cleanup[i].name);
  }
}