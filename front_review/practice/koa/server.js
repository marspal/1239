const server = require('./app');

server.use('/api/1/2/3', function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});

server.listen(3000, function(){
  console.log(123123123);
})