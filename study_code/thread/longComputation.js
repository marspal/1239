const http = require('http');
const fork = require('child_process').fork;

const server = http.createServer();
server.on('request', (req, res) => {
  if (req.url === '/compute') {
    const compute = fork('./compute.js');
    compute.send('开启一个新的子进程');
    compute.on('message', sum => {
      res.end(`Sum is ${sum}`);
      compute.kill();
    });
    compute.on('close', (code, singnal) => {
      console.log(`收到close事件,子进程收到信号${singnal}而终止,退出吗${code}`);
      compute.kill();
    });
  } else {
    res.end('Ok');
  }
});
server.listen(3000);