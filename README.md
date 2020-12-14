# 1239

From good to great BD集结号

## Table of content

- study_code
  源码学习: 包括react-family全家桶、koa、express及其相关的代码测试;
  代码都配上相关的测试代码；养成编写测试代码的习惯

- front_review
  包括css,js,html基础,以及一些框架的练习;

- 常用node库累积


- 学习笔记

### 常用的node库

1. glob

### 学习笔记

- koa学习

1. timing attacks: 在密码学中,时序攻击是一种侧信道攻击,攻击者试图通过分析加密算法的时间执行来推导出密码。每一个逻辑运算在计算机需要时间来执行,根据输入不同,精确测量执行时间,根据执行时间反推出密码。

怎么解决? hash算法: 特点
输出定长: 输入无论是普通密码还是大文件 输出长度都是固定的
相同输入的输出相同: 因此哈希算法可以通过输出的摘要校验输入数据的完整性

2. crypto 

- timingSafeEqual: This function is based on a constant-time algorithm.

```js
// 重点replace更函数的形式
function sign(data, key){
  return crypto.createHmac(alorithm, key)
    .update(data)
    .digest(encoding)
    .replace(/\/|\+|=/g, function(x){
        return ({"/": "_", "+": "-", "=": ""})[x]
    });
}
```

3. glob

4. cookie

- 会话期Cookie: 会话期 cookie 不设置 Expires 或 Max-Age 指令

- 持久化Cookie: 而是在特定的日期（Expires）或者经过一段特定的时间之后（Max-Age）才会失效。

- Cookie前缀: 名称中包含 __Secure- 或 __Host- 前缀的 cookie，只可以应用在使用了安全连接（HTTPS）的域中，需要同时设置 secure 指令。另外，假如 cookie 以 __Host- 为前缀，那么 path 属性的值必须为 "/" （表示整个站点），且不能含有 domain 属性。对于不支持 cookie 前缀的客户端，无法保证这些附加的条件成立，所以 cookie 总是被接受的。

```
// 当响应来自于一个安全域（HTTPS）的时候，二者都可以被客户端接受
Set-Cookie: __Secure-ID=123; Secure; Domain=example.com
Set-Cookie: __Host-ID=123; Secure; Path=/

// 缺少 Secure 指令，会被拒绝
Set-Cookie: __Secure-id=1

// 缺少 Path=/ 指令，会被拒绝
Set-Cookie: __Host-id=1; Secure

// 由于设置了 domain 属性，会被拒绝
Set-Cookie: __Host-id=1; Secure; Path=/; domain=example.com
```

- 非法域: 属于特定域的 cookie，假如域名不能涵盖原始服务器的域名，那么应该被用户代理拒绝


- cookie name & value的取值范围: /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;



5. 测试工具package: 
  
  SuperTest: HTTP assertions made easy via superagent.

6. [http](./http/Readme.md)
)