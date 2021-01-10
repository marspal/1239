## 组件开发全流程

### 前期准备

#### React基础 转到 react.md

#### 转化流程

TS file(.tsx) -> tsc -> es6 modules(.jsx) -> webpack等进行打包
需要统一的模块文件(index.tsx)

- 配置tsconfig.json 配置tsconfig.build.json

```js
 "build-ts": "tsc -p tsconfig.build.json"
``` 

- 导出css模块 node-sass
```
 "build-css": "node-sass "
```

#### npm
简介: Npm是node包管理器 
npm whoami 查看当前用户
npm config ls 当前配置信息 
npm adduser 注册或登录
npm link 关联本地测试
npm publish 发布

```
/Users/admin/.nvm/versions/node/v10.16.0/lib/node_modules/sparksharing -> /Users/admin/webspace/sparksharing 
创建软连接 连接到sparksharing
```
目标repo使用npm link 目录名
```
/Users/admin/webspace/sparksharingtest/node_modules/sparksharing -> /Users/admin/.nvm/versions/node/v10.16.0/lib/node_modules/sparksharing -> /Users/admin/webspace/sparksharing
```
 npm主要功能:

- 下载别人编写的第三方包到本地使用

- 下载并安装别人编写的命令行程序到本地使用

- 将自己编写的包活命令行程序上传到npm服务器

#### package.json

```
重要,重要字段说明:
```
> version

[规则](https://semver.org/lang/zh-CN/)

1. 主版本号：当你做了不兼容的 API 修改

2. 次版本号：当你做了向下兼容的功能性新增

3. 修订号：当你做了向下兼容的问题修正

> private: true false(不是私有的包)
> description 描述
> author license keywords
> homepage repository
> files: []

重要字段: 代表我们要把什么文件上传到npm当中去, 不写会使用gitignore里的信息, 
除此之外 一些默认文件会上传上去，如: package.json, Readme.md， changelog.md等

> scripts

自动钩子函数: 
- prepublish


> peerDependencies 解决依赖重复的问题, 输出相应日志
```json
"peerDependencies": {
 "react": ">=16.8.0",
 "react-dom": ">=16.8.0"
},
```
#### 精简package.json依赖
- 问题1: 把用到 dependencies 中的一些库移动到devDependencies中
- 问题2: 解决和react 库冲突问题: 

#### 添加发布和commit前的检查
- eslint检查 "lint": "eslint --ext .js,.ts,.tsx src", --max-warnings 设置warning 数量
- 测试的命令: "test": "react-scripts test"为开发时使用, 不会返回最终的结果, 设置环境变量CI

问题: 跨平台, 解决办法cross-env npm install --save-dev cross-env
"prepublish": "npm run test:nowatch && npm run lint&& npm run build"

- git pre-commit(没有这个命令) husky package解决这个问题 注意: node 版本问题


#### 生成文档站点
新增welcome.stores.tsx
调整顺序
```js
const loaderFn = () => {
 const allExports = [require('../src/welcome.stories.tsx')];
 const req = require.context('../src/components', true, /\.stories\.js$/);
 req.keys().forEach(fname => allExports.push(req(fname)));
 return allExports;
};
configure(loaderFn, module);
```
etc/nginx 


#### CI CD简介

之前流程:

组件库->git push->运行单元测试(单元测试以及e2e测试)->测试通过 -> npm publish-> 成功 ->build文档静态文件->上传服务器->生成文档站点

> CI-持续继承

- 频繁的将代码集成到主干(master)
- 快速发现错误
- 防止分支大幅偏离主干

> CD- 持续交互、持续部署

- 频繁的将软件的新版本,交互给质量团队或者用户
- 代码通过评审后,自动部署到生产环境

> 如何完成持续部署 travis-ci.com

- 注册登录 https://travis-ci.com/


### 组件的开发流程

- 代码结构, 一定量的js、css, 不需要任何展示文件
- 样式解决方案
- 组件需求分析和编码
- 组件测试用例分析和编码
- 代码打包输出和发布
- CI、CD, 文档生成

1. 创建项目 npx create-react-app sparksharing (--typescript) --template typescript

```
  注意: 
  The --typescript option has been deprecated and will be removed in a future release.
  In future, please use --template typescript.
```

2. [文件结构和代码规范](https://zh-hans.reactjs.org/docs/faq-structure.html#gatsby-focus-wrapper)

```
  参考antd 目录结构; create-react-app 默认自带eslint检查; 
  需要配置vscode 开启
```

3. 样式解决方案

- inline css (example: const divStyle = {color: blue})
  https://reactjs.org/docs/faq-styling.html
- css in js (styleComponent库)
- styled Component
- Sass/Less (antd, bootstrap都在使用)

4. 样式系统文件结构
  styles/
- _variables.scss(全局变量以及可配置设置)
- _mixins.scss(全局的mixins)
- _functions.scss(全局的functions) 
- _components/Button/_style.scss 

5. 创建自己组件库的色彩体系

- 系统色板 - 基础色板 + 中性色板 (http://zhongguose.com/#yanhong)
- 产品色板 - 品牌色(两个主要颜色构成(可乐颜色) primaryColor, secondColor) + 功能色板(bootstrap色彩体系)

6. 支持scss 默认不支持,  To use Sass, first install node-sass:

7. 组件库样式变量分类

- 基础色彩系统(5所示) 
- 字体系统: 

```
字体家族: 默认字体、等宽字体; 
字体大小: base lg sm; 
字重: lighter,light,normal,bold, bolder;
行高: base, lg, sm line-height: line-Boxes相关
标题大小: h1 ~ h6
连接: color, decoration, hover-color, hover-decoration

normalize.css 解决兼容问题
```
- 表单
- 按钮
- 边框姐阴影
- 可配置开关



#### 模块化
- 一组可重用的代码
- 可维护性
- 可重用性

#### mock server
- JSONPlaceholder
- mocky.io

#### 图标Icon的解决方案

- 上古时期 - 雪碧图(css sprite)
- 近代 - Font Icon
- 现代未来 - SVG

SVG 优势:

- 完全可控
- SVG即取即用,Font Icon要下载全部字体
- Font Icon还有很多奇怪的Bug

要使用的是 [react-fontawesome](https://github.com/FortAwesome/react-fontawesome)

```js
$ npm i --save @fortawesome/fontawesome-svg-core(核心库)
$ npm i --save @fortawesome/free-solid-svg-icons(svg)
$ npm i --save @fortawesome/react-fontawesome(react组件库)
```

#### 动画组件

> 动画的实现方式:

- css方式: transition(该属性不能继承, 必须精确添加) 
```
transform: 属性允许你旋转，缩放，倾斜或平移给定元素。这是通过修改CSS视觉格式化模型的坐标空间来实现的。
transform-origin: CSS属性让你更改一个元素变形的原点。
```

- react-transition-group

问题: display: none 影响其他属性的正常显示

解决方案: 
```
(display: none) -> (display: block; opacity: 0) ->动画效果-> (display: block, opacity: 1);
(display: block, opacity: 1) ->动画效果-> (display: block; opacity: 0) -> (display: none);
```
要实现这个效果: css 无法做到, 用到React 动画库, react-transition-group(Transition、CSSTransition、TransitionGroup)
```
it exposes transition stages, manages classes and group elements and manipulates the DOM in useful ways, 
making the implementation of actual visual transitions much easier
```

- CSSTransition
```
  (*-enter) ->forces a reflow-> (*-enter-active) -> 自定义timeout -> (*-enter-done)
  (*-exit)  ->forces a reflow-> (*-exit-active)  -> 自定义timeout -> (*-enter-done)
```
- 安装 npm install react-transition-group @types/react-transition-group --save

使用animate.css合集(https://daneden.github.io/animate.css/) 找到对应的动画

问题: 动态的渲染子组件(不需要display: block) unmountOnExit属性解决

### 组件测试

> 优点

- 高质量的代码
- 更早的发现Bug，减少成本
- 让重构和升级变得更加容易和可靠
- 让开发流程更加敏捷(开发新的feature没有后顾之忧)

> 测试金字塔

- UI(top e2e: end to end) -> Service -> Unit(bottom)

> React 组建特别适合单元测试

- Component - 组件化
- Function - 函数
- 单项数据流

#### Jest测试框架

简介: Jest is a delightful JavaScript Testing Framework with a focus on simplicity； also default testing Framework of create-react-app;

<!-- 初来咋到 -->

> Using Matchers 断言库 

<code>
  yarn add --dev jest
</code>
```js
// 简单示例:
test('description', () => {});
```

#### React测试框架 React Testing Library

facebook 推出: Test Utilities 这套工具 api复杂难用, 在其基础上封装了 react-Testing-Library

``简介:``  is a set of helpers that let you test React components without relying on their implementation details

React Testing Library 和 Enzyme是对ReactTestUtils封装

> API

1. render : Render into a container which is appended to document.body

```js
import { render } from '@testing-library/react'
render(<div />)
```

2. mock module (axios)

```js
// users.js
import axios from 'axios';

class Users {
  static all() {
    return axios.get('/users.json').then(resp => resp.data);
  }
}

export default Users;

// users.test.js
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});
```

> jest-dom: 新增自定义 Custom matchers(断言)  扩展Jest

#### setupTests.ts run test 提前运行

describe 分类

```
 case 笔记: 
 element为Dom元素 queryByText() HTMLElement | null；getByText(): HTMLElement 两个返回不一样
```

#### React组件文档 storybook

> 当前痛点: 主要目的(产出组件) 各种属性和行为的组件

- create-react-app 入口文件(App.tsx)不适合管理组件库
- 缺少行为追踪和属性调试功能(如添加 alert 确定方法是否调用、书写不同书写确定是否生效)

> 组件完美开发工具的应有的特点

- 分开展示各个组件不同属性下的状态
- 能追踪组件的行为并且具有属性的调试功能
- 可以为组件自动生成文档和属性列表

##### 安装并使用sb(storybook)

```js
// ../src/index.stories.js
import React from 'react';
import { Button } from '@storybook/react/demo';

export default { title: 'Button' };

export const withText = () => <Button>Hello Button</Button>;

export const withEmoji = () => (
  <Button>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
```
问题: 支持ts 在TypeScript Config配置中配置相关信息

@storybook/addon-info

@types/storybook__addon-info

@storybook/addon-docs

react-docgen-typescript-loader

>  addons: 扩展sb Basically, there are two types of addons. (Decorators and Native Addons)

1. Knobs: 和UI组件交互
2. Actions: 响应事件
3. Links: story之间跳转
4. source: This addon is used to show stories source in the addon panel.
5. info Addon：npm install --save @types/storybook__addon-info
作用: 1.书写组件的说明文档  2. 显示源代码 3. 组件的属性列表
问题是: 属性列表不能自动获取
解决办法: react-docgen 
6. react-docgen 文档生成器(stroybook自带) 要支持ts react-docgen-typescript-loader

【注意】: 要使用这个插件，需要修改代码 [规则](https://github.com/strothj/react-docgen-typescript-loader#limitations)

问题: num属性不能展开: 配置Loader Options  react-docgen-typescript

添加注释: jsdoc标准

样式调整:

```js

// 样式调整
const styles: React.CSSProperties = {
  padding: '20px 40px',
};
const Center = (storyFn: any) => <div style={styles}>
  <h3>组件演示</h3>
  {storyFn()}
</div>;

// 添加进addon
addDecorator(Center);
```





classnames @types/classnames(声明样式文件)