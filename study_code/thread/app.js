// const http = require('http');
// const server = http.createServer();
// server.listen(3000, () => {
//   process.title = '程序员的成长指北测试进程';
//   console.log('进程id', process.pid);
// });

const http = require('http');
const numCPUs = require('os').cpus().length;
const cluster = require('cluster');

if (cluster.isMaster) {
  console.log('Master process id is ', process.pid);
  // fork workers
  for(let i = 0; i < numCPUs; ++i){
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal){
    console.log('worker process died, id', worker.process.pid);
  });
} else {
  // Worker 可以共享一个TCP连接
  http.createServer(function(req, res){
    res.writeHead(200);
    res.end('hello world');
  }).listen(8000);
}
