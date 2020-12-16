/**
 * @file andyxu cookie的设置
 * 
 * 
 * 通过Cookie设置一条Cookie, 形成一个数组[Cookie, Cookie]
 * 生成Cookieres.setHeader('setHeader', [Cookie, Cookie])
 * 
 * 
 */

var Keygrip = require("./keygrip");
var http = require('http');
var cache = {}

/**
 * u0009 水平制表符
 * u0020-u007e 基本拉丁文
 * u0080   u00ff 带分音符的拉丁文小写字母Y字符(ÿ)
 * u0080 - u00ff: C1控制符及拉丁文补充
 * 因为u007F: DEL 排除
 */
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
var SAME_SITE_REGEXP = /^(?:lax|none|strict)$/i
// 定义所有的Cookie
function Cookies(req, res, options){
  if (!(this instanceof Cookies)) return new Cookies(req, res, options);
  this.secure = undefined;
  this.request = req;
  this.response = res;
  // 处理options
  if(options){
    if(Array.isArray(options)){
      this.keys = new Keygrip(options);
    }else if(options.constructor && options.constructor.name === 'Keygrip'){
      this.keys = options;
    }else {
      this.keys = Array.isArray(options.keys)? new Keygrip(options.keys) : options.keys;
      this.secure = options.secure;
    }
  }
}

Cookies.prototype.get = function(name, opts) {
  var sigName = name + '.sig',
      header, match, value, remote, data, index,
      signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys
  header = this.request.headers['cookie'];
  if(!header) return;

  match = header.match(getPattern(name));
  if(!match) return;

  value = match[1]
  if (!opts || !signed) return value;

  remote = this.get(sigName)
  if (!remote) return
  data = name + "=" + value

  if (!this.keys) throw new Error('.keys required for signed cookies');
  index = this.keys.index(data, remote)

  if (index < 0) {
    this.set(sigName, null, {path: "/", signed: false })
  } else {
    index && this.set(sigName, this.keys.sign(data), { signed: false })
    return value
  }
}
Cookies.prototype.set = function(name, value, opts){
  var res = this.response,
      req = this.request,
      headers = res.getHeader("Set-Cookie") || [],
      secure = this.secure !== undefined ? !!this.secure : req.protocol === 'https' || req.connection.encrypted,
      cookie = new Cookie(name, value, opts),
      signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys

  if (typeof headers == "string") headers = [headers];
  if(!secure && opts && opts.secure){
    throw new Error('Cannot send secure cookie over unencrypted connection');
  }
  cookie.secure = opts && opts.secure !== undefined
    ? opts.secure
    : secure;

  if (opts && "secureProxy" in opts) {
    // deprecate('"secureProxy" option; use "secure" option, provide "secure" to constructor if needed')
    cookie.secure = opts.secureProxy
  }
  pushCookie(headers, cookie);
  if (signed){
    if (!this.keys) throw new Error('.keys required for signed cookies');
    cookie.value = this.keys.sign(cookie.toString())
    cookie.name += '.sig';
    pushCookie(headers, cookie); 
  }
  var setHeader = res.set ? http.OutgoingMessage.prototype.setHeader : res.setHeader;
  setHeader.call(res, 'Set-Cookie', headers);
  return this;
}

// 每一个Cookie
function Cookie(name, value, attrs){
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }
  if(value && !fieldContentRegExp.test(value)){
    throw new TypeError('argument value is invalid');
  }
  this.name = name;
  this.value = value || '';

  // 代理所有attrs属性? 也会代理原型链所有属性
  for(var name in attrs){
    this[name] = attrs[name];
  }

  if(!this.value){
    this.expires = new Date(0);
    this.maxAge = null;
  }

  if (this.path && !fieldContentRegExp.test(this.path)) {
    throw new TypeError('option path is invalid');
  }

  if (this.domain && !fieldContentRegExp.test(this.domain)) {
    throw new TypeError('option domain is invalid');
  }
  if (this.sameSite && this.sameSite !== true && !SAME_SITE_REGEXP.test(this.sameSite)) {
    throw new TypeError('option sameSite is invalid')
  }
}

Cookie.prototype.path = "/";
Cookie.prototype.expires = undefined;
Cookie.prototype.domain = undefined;
Cookie.prototype.httpOnly = true;
Cookie.prototype.sameSite  = false;
Cookie.prototype.secure = false;
Cookie.prototype.overwrite = false;

Cookie.prototype.toString = function(){
  return this.name + "=" + this.value;
}

Cookie.prototype.toHeader = function(){
  var header = this.toString();
  if(this.maxAge) this.expires = new Date(Date.now() + this.maxAge);

  if(this.path) header += "; path=" + this.path;
  if(this.expires) header += "; expires =" + this.expires.toUTCString();
  if(this.domain) header += "; domain=" + this.domain;
  if(this.sameSite) header += "; samesite=" + (this.sameSite  === true ? 'strict' : this.sameSite.toLowerCase());
  if(this.secure) header += "; secure";
  if(this.httpOnly) header += "; httponly";

  return header;
}

Object.defineProperty(Cookie.prototype, 'maxage', {
  configurable: true,
  enumerable: true,
  get: function(){ return this.maxAge},
  set: function(val){ return this.maxAge = val}
});

// overWrite: true 删除旧的Cookie
function pushCookie(headers, cookie){
  if (cookie.overwrite) {
    for (var i = headers.length - 1; i >= 0; i--) {
      if (headers[i].indexOf(cookie.name + '=') === 0) {
        headers.splice(i, 1)
      }
    }
  }
  headers.push(cookie.toHeader());
}

function getPattern(name) {
  if (cache[name]) return cache[name]

  return cache[name] = new RegExp(
    "(?:^|;) *" +
    name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") +
    "=([^;]*)"
  )
}

Cookies.Cookie = Cookie;

module.exports = Cookies;