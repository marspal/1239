 ## 前言

前端三大件:
- HTML 结构
- CSS 样式
- JS 行为

table of content
 
- HTML常见的元素和理解
- HTML版本
- HTML元素的分类
- HTML元素的嵌套关系
- HTML元素默认样式和定制化
- 面试真题解答

### HTML常见的元素和理解

> head 在页面中不会显示相关信息
- meta
  <meta charset="utf-8"> 页面的字符集,
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum=1.0,user-scalable=no">;  user-scalable=no用户不能缩放
- title
- style
- script
- link
- base
  <base href="http://www.w3school.com.cn/i/"> 定义基础路径 <img src="eg_smile.gif" /><br /> img的url:http://www.w3school.com.cn/i/eg_smile.gif
  <base target="_blank" />
  注意：<a href="http://www.w3school.com.cn">W3School</a>
  链接会在新窗口中打开，即使链接中没有 target="_blank" 属性。这是因为 base 元素的 target 属性已经被设置为 "_blank" 了

> body 
- div/section/article/aside/header/footer
- p
- span/em/strong
- table/thead/tbody/tr/td
- ul/ol/li/dl/dt/dd
- a
- form/input/select/textarea/button

> 重要属性
a[href, target]
img[src,alt]
table td[colspan, rowspan]
form[target,method,enctype]
input[type,value]
button[type]
select>option[value]
label[for]

input type="radio" name一样是同一组的 (button  type="submit" type="reset") (input type="submit") 出现在form 中才有意义

[html版本]("../image/html版本.png");

html5新增内容:
- 区块标签 section、article、nav、aside
- 表单增强： 日期、时间 搜索， 表单验证, placeholder 自动聚焦
- 新增语义: 
1. header/footer 头尾
2. section/article 区域
3. nav导航
4. aside 不重要的内容
5. em/strong 强调
6. i icon做图标
- 新增api 离线 音视频 图形 实时通讯
- 分类和嵌套变更

> html分类
- 按默认样式分
1. 块级 block, 默认占一行
2. 行内 inline, 不独占一行, 形状不规则, width,height不起作用
3. inline-block 不独占一行, 块级

- 按内容分(h5新增)
1. Flow元素: heading (h1~h6) Sectioning
2. Meta元素

> 嵌套关系 来自于分类和content-modal
- 块级元素可以包含行内元素
- 块级元素不一定能包含块级元素 p不能包含div
- 行内元素一般不能包含块级元素: h5 a可以包含div; 计算合法性的时候 直接忽略a元素

<p><a><div></div></a></p> 不合法; 直接忽略a元素

> html默认样式

- 默认样式的意义 form
- 默认样式带来的问题
- css Reset (YUI) -> Normalize.css

真题:
- doctype的意义是什么
1. 让浏览器以标准模式渲染
2. 让浏览器知道元素的合法性

- HTML XHTML HTML5 的关系
1. HTML 属于SGML
2. XHTML 属于XML,是对HTML进行XML严格化的结构
3. HTML5不属于SGML或XML, 比XHTML宽松 

- 语义化的意义
1. 开发者容易理解
2. 机器容易理解 
3. seo

- attribute vs property
1. attribute 是死的
2. property  是活的

