function ajax(type, url, data){
  var xhr = new XMLHttpRequest();
  xhr.open(type, url, true);
  xhr.send(data);
}

var ajax = curry(ajax);
var post = ajax("POST");
post("www.test.com", "name=kevin");

var postFromTst = post("www.test.com");
postFromTst("name=kevin");

var curry = function(fn){
  var args = [].slice
}