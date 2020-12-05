const http = require('http');

let hello = '';
for(var i = 0; i < 10240; i++){
  hello += "a";
}

console.log(`hello: ${hello.length}`);
hello = Buffer.from(hello);
http.createServer((req, res) => {
  if (req.url == 'favicon.ico') return;
  res.writeHead(200);
  res.end(hello);
}).listen(8002);