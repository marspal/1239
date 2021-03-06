var http = require('http')
var Cookies = require('cookies')

// Optionally define keys to sign cookie values
// to prevent client tampering
var keys = ['keyboard cat']

var server = http.createServer(function (req, res) {
  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys})

  // Get a cookie
  var lastVisit = cookies.get('LastVisit')
  var LastVisitSig = cookies.get('LastVisit.sig');
  console.log(lastVisit, LastVisitSig, req.headers.cookie);

  // Set the cookie to a value
  cookies.set('LastVisit',  ['name=123', 'value=123123']);
  res.setHeader('Set-Cookie', "nameasdasdasd");
  console.log(res.getHeader('Set-Cookie'))
  const ip = res.socket.localAddress;
  const port = res.socket.localPort;
  const ip1 = req.socket.localAddress;
  const port1 = req.socket.localPort;
  console.log(`您的 IP 地址是 ${ip}，您的源端口是 ${port}`);
  console.log(`您的 IP 地址是 ${ip1}，您的源端口是 ${port1} ===`);
  if (!lastVisit) {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Welcome, first time visitor!')
  } else {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Welcome back! Nothing much changed since your last visit at ' + lastVisit + '.')
  }
})

server.listen(3000, function () {
  console.log('Visit us at http://127.0.0.1:3000/ !')
})