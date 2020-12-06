var http = require('http')
var Cookies = require('cookies')

// Optionally define keys to sign cookie values
// to prevent client tampering
var keys = ['keyboard cat']

var server = http.createServer(function (req, res) {
  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys })

  // Get a cookie
  var lastVisit = cookies.get('LastVisit', { signed: true })
  var lastVisit1 = cookies.get('LastVisit1', { signed: true })

  // Set the cookie to a value
  cookies.set('LastVisit', "abcdefg"+res.socket.remotePort, { signed: true })
  cookies.set('LastVisit1', "abcdefg1"+res.socket.remotePort, { signed: true })
  console.log(lastVisit, lastVisit1);
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