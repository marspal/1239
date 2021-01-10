var debug = require('debug')('http');
var http = require('http');
var name = 'myApp';

debug('booting %o', name);

http.createServer(function(req, res){
  debug(req.method + ' ' + req.url);
  res.end('hello\n');
}).listen(3000, function(){
  debug('listening');
});

require("./worker");