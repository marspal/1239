var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var mime = require('./mime').types;
var port = 8000;

var server = http.createServer(function(request, response){
  // 文件存在读取文件内容
  var pathname = url.parse(request.url, true).pathname;
  var realPath = 'assets' + pathname;
  var ext = path.extname(realPath);
  ext = ext ? ext.slice(1) : 'unknow';
  var config = require("./config");
  var contentType = mime[ext] || 'text/plain';
  if(ext.match(config.Expires.fileMatch)){
    // 需要开启新的标签 就能看见
    var expire = new Date();
    expire.setTime(expire.getTime() + config.Expires.maxAge * 1000);
    response.setHeader("Expires", expire.toUTCString());
    response.setHeader("Cache-Control", "max-age="+config.Expires.maxAge);
  }
  fs.exists(realPath, function(exists){
    if(!exists){
      response.writeHead(404, {
        "Content-Type": contentType
      });
      response.write("This request URL "+ pathname + " was not fond in this server");
      response.end();
    } else {
      fs.stat(realPath, function(err, stat){
        var lastModified = stat.mtime.toUTCString();
        response.setHeader("Last-Modified", lastModified);
        if(request.headers["if-modified-since"] && lastModified === request.headers["if-modified-since"]){
          response.writeHead(304, "Not Modified");
          response.end();
        } else {
          fs.readFile(realPath, 'binary', function(err, file){
            if(err){
              response.writeHead(500, {
                "Content-Type": contentType
              });
            }else{
              response.writeHead(200, {
                "Content-Type": contentType
              });
              response.write(file, 'binary');
              response.end();
            }
          })
        } 
      });
    }
  });
});

server.listen(port);
console.log('Server running at port: '+ port);