const http = require("http");

http.createServer((req, res) => {
  const cookie = req.headers.cookie;
  console.log(cookie);
  res.setHeader('Set-Cookie', 'SSID=Ap4GTEq;HttpOnly');
  res.setHeader('Set-Cookie', 'name=123123;HttpOnly');
  res.writeHead(200, {
    'Content-Type': 'text/html;charset=utf8'
  });
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`您的 IP 地址是 ${ip}，您的源端口是 ${port}`);
  res.end('3040');
}).listen(3000);