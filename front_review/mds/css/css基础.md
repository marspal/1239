## css 基础:

id > class > 元素

> 浏览器的解析方式:
如下: .hello -> div -> .body
.body div .hello {
  
}

> 选择器的分类

- 元素选择器 a{}
- 伪元素选择器 ::before{}
- 类选择器 .link {}
- 属性选择器 [type=radio]{}
- 伪类选择器 :hover{}
- id选择器 #id{}
- 组合选择器 [type=checkbox] + label{}
- 否定选择器 :not(.link){}
- 通用选择器 * 

> 选择器的权重
- id  +100
- 类 属性 伪类 +10
- 元素 伪元素 +1
- 其他选择器 +0

例子:
计算一个不进位的数字
- #id .link a[href]  #id .link .active 
  #id +100           #id +100
  .link +10          .link +10
  a +1               .active +10
  [href] +10
  121                 120

- 计算
#test { +100
  color: red;
}

#test.test { +110 显示蓝色
  color: blue;
}

.test2 { +10
  color: red;
}
div.test2  {+11
  color: blue;
}

#test3 { +100
 color: red;
}
.c1 ... .cn { <100 不生效

}

- !important 优先级最高
- (元素属性 !important) > id
- 相同权重后写的生效

 !important>行内样式>ID选择器 > 类选择器 | 属性选择器 | 伪类选择器 > 元素选择器 > 其他选择器

 ### 非布局样式

- 字体、字重、颜色、大小、行高
- 背景、边框
- 滚动、换行
- 粗体、斜体、下划线
- 其它


- 字体族: serif(衬线字体), sans-serif monospace(等宽) cursive手写 fantasy(花体) 不需要银行
.chinese {
  font-family: "PingFang Sc", "Microsoft Yahei", monospace;
}
- 多字体: fallback机制, 针对每一个字符
- 网络字体、自定义字体
```css
// 网络字体url 需要跨域
@font-face {
  font-family: "IF",
  src: url("./Follow/ttf") 
}

.custom-font{
  font-family: IF
}
```

iconfont

- 行高的构成
inline元素: inline-box、匿名的inline-box, 设置line-height 对inline-box不起作用, 顶线和底线是文本占据的区域, x底部是基线, 默认基线对齐;
line-height决定外面的盒子的高度,撑起高度;

line-height由line-box决定的

```html
<div>
  <span>123</span>
  <span>123</span>
  123
  <span> 1233</span>
</div>
```
- 行高相关的现象和方案
设置垂直居中 设置line-height

问题: 图片下有空隙? 原理是什么

图片display: inline; 按照base line对齐, base line和底线是有偏差的; 所以下有一个空隙; 解决办法: vertical-align:bottom; 按底线对齐; display: block;

- 行高的调整


> 背景
hsl
- 背景颜色
- 渐变色叠加
line-gradient(to right, red, right)
- 多背景叠加
- 背景图片和属性(雪碧图)
- base64和性能优化
- 多分辨率 

> float
- 元素“f浮动”
- 脱离文档流
- 但不脱离文本流

- 对自身的影响:
  1. 形成“块” BFC,span 都可以设置width height起作用
  2. 位置尽量靠上
  3. 位置尽量靠左(右)
- 对兄弟元素的影响:
  1. 上面贴非float元素
  2. 旁边贴float元素
  3. 不影响其他块级元素的位置
  4. 影响其他块级元素的内部文本
- 父级元素
  1. 从布局上“消失”
  2. 高度塌陷


> 效果属性

- box-shadow
   
- text-shadow
- border-shadow
- backgroud
- clip-path


> 3D 变换

- 变换 transform
1. translate: 位移
2. scale: 缩放
3. skew: 斜切
4. rotate: 旋转

- 在3D空间中进行变换
示例: 3D


> margin
- 垂直外边距合并问题
一个盒子如果没有上补白(padding-top)和上边框(border-top)，那么这个盒子的上边距会和其内部文档流中的第一个子元素的上边距重叠。
父元素的第一个子元素的上边距margin-top如果碰不到有效的border或者padding.就会不断一层一层的找自己“领导”(父元素，祖先元素)的麻烦。只要给领导设置个有效的 border或者padding就可以有效的管制这个目无领导的margin防止它越级，假传圣旨，把自己的margin当领导的margin执行

总结下来margin 属性可以应用于几乎所有的元素，除了表格显示类型（不包括 table-caption, table and inline-table）的元素，而且垂直外边距对非置换内联元素（non-replaced inline element）不起作用。

> float
确实要浮动一个非替换元素, 则必须为该元素声明一个width,否则根据css规范，元素的宽度
趋近于0; 

- 浮动的详细内幕
浮动元素的包含块是其最近的块级祖先元素,浮动元素会生成一个块级框,而不论这个元素本身是什么。

浮动元素摆放规则:
1. 浮动元素的左(右)外边界不能超出其包含块的内边界;
2. 浮动元素的左(右)外边界必须是源文档中之前出现左(右)元素的右(左)边界;除非后出现
浮动元素的顶端在先出现浮动元素的低端下面;
3. 左浮动元素的右边界不会在其右边右浮动元素的左外边界; 防止元素相互重叠
4. 一个浮动元素的顶端不能比其父元素的内顶端更高;
5. 浮动元素的顶端不能比之前浮动元素或框架元素的顶端更高
7. 如果没有浮动的空间, 浮动元素会被挤到新的行上
8. 浮动元素尽可能高
9. 浮动元素尽可能远

浮动元素比父元素高

300
