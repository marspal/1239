var Keygrip = require("./keygrip");

// 定义所有的Cookie
function Cookies(req, res, options){
  if (!(this instanceof Cookies)) return new Cookies(req, res, options);
  this.secure = undefined;
  this.request = req;
  this.response = res;
  // 处理options
}

Cookies.prototype.get = function(name, opts){}
Cookies.prototype.set = function(name, value, opts){}

// 每一个Cookie
function Cookie(name, val, attrs){

}

Cookie.prototype.path = "/";
Cookie.prototype.expires = undefined;
Cookie.prototype.domain = undefined;
Cookie.prototype.httpOnly = true;
Cookie.prototype.sameSite  = false;
Cookie.prototype.secure = false;
Cookie.prototype.overwrite = false;