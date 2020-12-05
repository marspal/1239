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

  