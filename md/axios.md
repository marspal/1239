## ts axios
### table of content

> todo
- 项目脚手架
- 基础功能实现
- 异常情况处理
- 接口扩展
- 拦截器实现
- 配置化实现
- 取消功能实现
- 更多功能实现

> 前端工具
- Jest测试
- Commitizen
- Rollup js打包构建
- TSLint 代码风格一致性
- Prettier 美化项目
- Semantic release 版本发布

类型保护机制:
```ts
function getSmallPet(): Fish | Bird{}
let pet = getSmallPet();
if((pet as Fish).swim){
  (pet as Fish).swim();
}else if((pet as Bird).fly){
  (pet as Bird).fly();
}

if(isFish(pet)){
  pet.swim();
}else{
  pet.fly();
}

function isFish(pet: Bird | Fish): pet is Fish {
  return (pet as Fish).swim !== undefined
}
```
null、undefined 可以是类型 可以是值; null不能赋值给number、string

```ts
// sn! !类型断言
function f(sn: string | null): string{
  return sn! || 'default'
}
```

### 需求分析

> Features

- 在浏览器使用XMLHttpRequest对象通讯
- 支持Promise Api 
- 支持请求和相应拦截器
- 支持请求数据和响应数据的转换
- 支持请求取消
- JSON数据制动转换
- 客户端防止XSRF


### 脚手架搭建
TypeScript library: 

> 知识点: 
1. 创建工程并关联远程分支
- 查看远程分支: git remote -v
- 关联远程分支: git remote add origin git@url
- 拉取远程分支: git pull origin master
- git branch: 查看当前分支
- git add
- npm run commit: 调用commitizen

2. 创建入口文件、types文件简单实现xhr发送功能

3. 创建demo运行中间件

- 新增demo 运行环境的包
```
webpack:
webpack-dev-middleware: 
webpack-hot-middleware: 实现hot reloading into server
ts-loader
tslint-loader
express
body-parser
```

- 新增webpack 配置文件

### 知识点

> XMLHttpRequest 相关知识点

- 继承方式
EventTarget <- XMLHttpRequestEventTarget <- XMLHttpRequest

- 通信方式
如果您的通信需要重服务器接收事件和消息数据,
请考虑通过 EventSource 接口使用 server-sent events。
对于全双工的通信， WebSocket 可能是更好的选择。

- XMLHttpRequest.send方法

用于发送http请求,如果是异步请求(默认异步),方法会在请求发送后立即返回;
如果是同步请求则此方法直到响应到达后才会返回。方法接受一个可选的参数，
其作为请求主体；如果请求方法是 GET 或者 HEAD，则应将请求主体设置为 null

```
XMLHttpRequest.send();
XMLHttpRequest.send(ArrayBuffer data);
XMLHttpRequest.send(ArrayBufferView data);
XMLHttpRequest.send(Blob data);
XMLHttpRequest.send(Document data);
XMLHttpRequest.send(DOMString? data);
XMLHttpRequest.send(FormData data);
```

英文文档: 要比中文文档好
1. A Document, in which case it is serialized before being sent.
2. Blob, BufferSource, FormData, URLSearchParams, USVString.
3. null

这里可以解释为什么普通object json.stringify转换: 包含在USVString这种类型中

- responseType 属性是一个枚举类型，返回响应数据的类型
1. "" responseType 为空字符串时，采用默认类型 DOMString，与设置为 text 相同。
2. arraybuffer: response 是一个包含二进制数据的 JavaScript ArrayBuffer
3. blob response 是一个包含二进制数据的 JavaScript ArrayBuffer。
4. document response 是一个 HTML Document 或 XML XMLDocument，这取决于接收到的数据的 MIME 类型
5. json response 是一个 JavaScript 对象。这个对象是通过将接收到的数据类型视为 JSON 解析得到的。
6. text response 是一个以 DOMString 对象表示的文本

- http 请求
1. ＜request-line＞(请求行)
2. ＜headers＞(请求消息头)
3. ＜blank line＞(空行)
4. ＜request-body＞(请求消息数据)
content-type是请求消息头中的一个请求参数, 标识请求消息数据的格式;

- http 响应
1. ＜status-line＞(状态行)
2. ＜headers＞(消息报头)
3. ＜blank line＞(空行)
4. ＜response-body＞(响应正文)
content-type是响应消息报头中的一个参数, 标识响应正文数据的格式;

- content-type组成
格式: Content-Type: type/subtype;parameter;
例子: Content-Type: text/html;charset:utf-8;

1. 主类型type:
a. text ---- 文本类型
b. application ---- 应用类型
c. * 所有类型
2. 子类型substype: html、xml、json、* 所有格式
3. 参数parameter 编码方式charset:utf-8
4. 常见的媒体类型: 即是互联网媒体类型，也叫作MIME-Type
5. 主类型text
```
  text/html ： HTML格式
  text/plain ：纯文本格式      
  text/xml ：  XML格式(忽略xml头所指定编码格式而默认采用us-ascii编码)
  image/png： png图片格式
```
6. 主类型是application
```
application/xhtml+xml ：XHTML格式
application/xml     ： XML数据格式(根据xml头指定的编码格式来编码)
application/json    ： JSON数据格式
application/octet-stream ： 二进制流数据（如常见的文件下载）
```

7. 请求content-type的三种设置方式
a. 设置在发送请求页面的header中
 <meta content="text/html" charset="utf-8"/>
b. 设置在form表单提交的enctype参数中
c. 设置在request header参数中

### 核心功能

> params 处理

- 参数为数组[]: 
params: {
  foo: ['bar',baz]
}
"/base/get?foo[]=bar&foo[]=baz"

- 参数为对象{}
params: {
  foo: {
    bar: 'baz'
  }
}
"/base/get?encode(foo)=encode({bar: 'baz'})"

- 参数值为Date类型
params: {
  date
}
"/base/get?date=date.toISOString()"

- 特殊字符
@、:、$、,、空格 [、],允许出现在url中,不希望被encode
最终请求的url是"/base/get?foo=@:$+" 注意把空格转换成+

- 空值忽略
对于为null或者undefined的属性,不添加到url
params: {
  foo: 'bar',
  baz: null
}
"/base/get?foo=bar"

- 丢弃url中hash标记
axios({
  url: "/base/get#hash",
  params: {
    foo: 'bar'
  }
});
最终请求的url是 base/get?foo=bar

- 保留url中已存在的参数
axios({
  url: "/base/get?foo=bar",
  params: {
    foo: 'baz'
  }
});
最终请求的url是 base/get?foo=bar&foo=baz

- example 验证


> 处理请求body数据

- request 转换: 普通对象要JSON.stringify()

```js
const arr = new Int32Array([21, 31]);
axios({
  method: "post",
  url: "/base/buffer",
  data: arr
});

router.post("/base/buffer", function(req, res){
  let msg = [];
  req.on("data", (chunk) => {
    if(chunk){
      msg.push(chunk)
    }
  })
  req.on("end", () =>{
    let buf = Buffer.concat(msg);
    res.json(buf.toJSON());
  })
});

```


- response 转换: 返回数据是string,进行JSON.parse处理

> 处理header

1. 格式化headerName, 处理请求header

2. 实例: 知识点
浏览器给设置了content-type: application/x-www-form-urlencode; utf-8
传入的数据为form Data
```js
const paramsString = 'q=URLUtils.searchParams&topic=api'
const searchParams = new URLSearchParams(paramsString)

axios({
  method: "post",
  url: "/base/post",
  data: searchParams
});

```

```服务端数据处理```

> 获取响应数据

- 支持Promise 支持异步

- 对返回数据res进行封装: 
1. 服务端数据data
2. http 状态码
3. 状态消息
4. 响应头headers
5. 请求配置对象 config
6. 请求的XMLHttpRequest 对象实例 request

- response headers处理:

通过的getAllResponseHeaders 并对字符串处理 字符串以\r\n分割, parseHeaders

- 处理相应的data

注意: 在不设置responseType时, 当服务器给我们数据是字符串时, 尝试转换成json


> 异常情况处理

1. 处理网络异常错误

网络异常时候发送异常发送请求会触发XMLHttpRequest对象实例的error, 于是onError的时间回调捕获此类错误

```js
  request.onerror = function handleError(){
    reject(new Error('Network error'))
  }
```

2. 处理超时错误
可以设置某个请求的超时错误,也就是请求发送后超过某个时间仍然没收到响应, 则请求自动终止, 并触发ontimeout, 默认为0, 永不超时
```js
  request.ontimeout = function handleTimeout(){
    reject(new Error(`Timeout of ${timeout} ms exceeded`))
  }
```

3. 非200状态码处理

正常请求: 200 ~ 300

status: status 的值是一个无符号短整型。在请求完成前，status的值为0。值得注意的是，如果 XMLHttpRequest 出错，浏览器返回的 status 也为0
readystate: 4 操作完成
```js
request.onreadystatechange =function(){
  if(request.readystate !== 4) {
    return; // 操作为完成
  }
  if(rquest.status === 0){
    return ;
  }

  const response = {};
  handleResonse(response)
}
function handleResonse(response){
  if(response.status >= 200 && response.status < 300){
    resolve(response)
  }else{
    reject(new Error(`Request failed width status code ${response.status}`))
  }
}
```

4. 错误信息增强

对任务进行增强 包括: 请求对象配置config、错误代码code、XMLRequest对象实例request、以及相应对象response

a: 创建AxiosError类

问题 继承Error、Array、Map无法正常工作

原因: Error 是一个特殊的存在，即是一个构造函数，也是一个普通函数。以下两种调用皆可返回 error object。
那么在调用以下函数时，_super 为 Error，返回的即是 Error(this, arguments)，而不是 this
```js
_super !== null && _super.apply(this, arguments) || this;
Object.setPrototypeOf(this, Axios.prototype)
```
但是这个写法其实相当的傻，因为对于每一个子类的构建函数来说，在改变原型之前，是无法拿到正确的子类实例'this.constructor' 的，所以 Object.setPrototypeOf 需要出现在所有子类的构建函数中。

b: 应用createError, 替换原有new Error

c: 新增类型导出, 解决examples 类型引入问题; 重构index.ts, 新增axios

> 扩展接口

- axios.request(config)
- axios.get(url[, config])
- axios.delete(url[, config])
- axios.head(url[, config])
- axios.options(url[, config])
- axios.post(url[,data[, config])
- axios.patch(url[,data[, config])
- axios.put(url[,data[, config])

注意: 使用这些方法, 不用config指定url、method、data这些属性了
axios更像一个混合对象了,本身是一个方法,又有很多方法属性,实现混合对象

1. 接口类型定义

混合对象axios本身是一个函数,基于类的方式去实现其它的方法属性，然后把这个
类的原型属性和自身在拷贝到axios上
a: 定义原型属性Axios(抽象axios中公共方法)
b: 定义AxiosInstance

2. 实现: 在core目录下定义一个axios.ts, 实现Axios interface
3. 模块化: 抽象axios方法，抽象成dispatchRequest
4. 实现Axios类中所有方法
5. 实现混合对象

混合对象实现思路很简单, 首先对象是个函数, 其次这个对象要包括Axios类所有原型属性和实例属性

```ts
export function extend<T, U>(to: T, from: U): T & U{
  for(const key in from){
    ;(to as T & U)[key] = from[key] as any;
  }
  return to as T & U
}
```

```ts
function createInstance(): AxiosInstance{
  const context = new Axios();
  const instance = Axios.prototype.request.bind(context);
  extend(instance, context)
  return instance as AxiosInstance;
}

const axios = createInstance();
export default axios;
```

6. axios函数重载;

axios支持一个参数
```ts
  axios({
    url: '/extend/post',
    method: 'post',
    data: {
      msg: 'hi'
    }
  })
```
需要支持二个函数

```ts
axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'hello'
  }
})
```

实现: 
```ts
export interface AxiosInstance extends Axios{
  (config: AxiosRequestConfig): AxiosPromise;
  (url: string, config?: AxiosRequestConfig): AxiosPromise;
}
// 无需修改interface Axios, 只是在代码实现
request(url:any, config?: any): AxiosPromise{
  if(typeof url === 'string'){
    if(!config){
      config = {}
    }
    config.url = url;
  } else {
    config = url;
  }
  return dispatchRequest(config)
}
```
> 响应数据支持泛型

example:
```js
interface ResponseData<T=any>{
  code: number;
  result: T;
  message: string;
}

interface User {
  name: string;
  age: number;
}

function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(err => console.log(err))
}

async function test(){
  const user = await getUser<User>();
  if(
    user
  ){
    console.log(user.result.name)
  }
}

test();
```

> 拦截器实现
1. 实例
```js
  // 添加一个请求拦截器
  axios.interceptor.request.use(function (config){
    return config
  }, function(err){
    // 处理请求错误
    return Promise.reject(err)
  })

  // 响应拦截器
  axios.interceptor.response.use(function(response){
    return response;
  }, function(err){
    return Promise.reject(err)
  });

  // 删除拦截器
  const myInterceptor = axios.interceptor.request.use(function(){})
  axios.interceptor.request.eject(myInterceptor)
```

2. 整体设计
(config) -> in1 -(config)-> in2 -(config)->send request -(response)-> re1 -（response）-> re2 
支持同步异步的方式 想到用Promise的链式调用

3. 拦截器的管理类实现
axios拥有一个interceptors对象属性,该属性又有request、response两个属性,他们对外提供一个use方法, 把这两个方法当成请求拦截器的管理对象AxiosRequestConfig, AxiosResponse
```js
 forEach(fn: (interceptor: Interceptor<T>) => void ): void {
    this.interceptors.forEach(interceptor => {
      if(interceptor !== null)
        fn(interceptor)
    })
  }
```
4. 拦截器的链式调用
 

> 合并配置的设计与实现

1. 需求分析: 和官网保持一致, 给axios对象添加一个defaults属性，表示默认配置，甚至可以直接
修改这些默认配置, 未不同的方法添加默认配置 方法分为有data NoData
```js
axios.defaults.header.common['test'] = 123
axios.defaults.header.post['content-type'] = 'application/x-www-from-urlencode'
axios.defaults.timeout = 2000
```

2. 合并config 这里由策略
3. flatten 数据
4. 请求和响应配置化

官方的axios库给默认配置添加了transformRequest和transformResponse两个字段，
他的值是一个数组和是一个函数; 其中transformRequest允许你在将数据发给服务器之前进行修改
只适用于put、post、patch;如果值是数组,则数组中的最后一个函数必须返回一个字符串或者
FormData、URLSearchParams、Blob等类型作为xhr.send方法的参数，而且在transform过程中
可以修改headers;
而transformResponse允许你把响应数据传递给then或者catch之前对他们进行修改;当值为数组的时候,数组的每一个函数都是一个转换函数，数组中的函数就像一个管道一样依次执行，前者的输出作为
后者的输入;

```ts
axios({
  transformRequest: [(function(data){
    return qs.stringify(data)
  }), ...axios.defaults.transformRequest],
  transformResponse: [axios.defaults.transformResponse, function(data){
    if(typeof data === 'object'){
      data.b = 2
    }
    return data;
  }]
})
```

修改默认配置: 新增加 transformRequest, transformResponse 主要作用就是处理
data header, data

5. transform逻辑重构
重构之前写的对请求应用数据的处理逻辑，由于我们可能编写多个转换函数
我们定义一个transform函数来处理转换这些调用逻辑

```ts
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransform | AxiosTransform[]
): any{
  if(!fns){
    return data;
  }
  if(!Array.isArray(fns)){
    fns = [fns];
  }
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
```
6. 扩展axios.create静态api
解决问题: 修改默认配置 影响所有的请求，axios.create 创建新的实例

```ts
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
}
```

> 取消功能的设计和实现

```ts
axios.get('/url/', {
  cancelToken: new CancelToken(function exector(c) {
    cancel = c;
  })
})
cancel()
```

```ts
axios.get('/url/123', {
  cancelToken: source.token
}).catch(function(e) => {
  if(axios.isCancel(e)){
    console.log('Request canceled', e.message);
  }else{
    // 处理错误
  }
})
source.cancel('Operation canceled by the user.')
```

1. 异步分离的设计分案
 我们需要为该请求配置一个cancelToken, 在外面调用一个cancel方法
 原理是: 调用请求的xhr.abort方法

```ts
  if(cancelToken){
    cancelToken.promise.then(reason => {
      request.abort()
      reject(reason)
    })
  }
```

2. CancelToken 实现

3. Canel类实现与axios扩展
实现Cancel类的原因，区别出当前错误是否为CancelToken产生

4. 修改reason处的定义

```ts
// reason: string to Cancel
export interface CancelToken {
  promise: Promise<string>
  reason?: string
  throwIfRequested(): void
}
```
```ts
// axios 扩展
axios.create = function(config){
  return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel
```

5. 额外逻辑实现

CancelToken已经被使用过了，那我们不发送请求, 抛出异常就行, 抛出的异常就是取消的原因,所以给CancelToken扩展一个方法

```ts
  export default class CancelToken{
    throwIfRequested(): void {
      if(this.reason){
        throw this.reason
      }
    }
  }
```

> 更多功能

1. withCredentials

问题: 同域情况下, 我们发送的请求默认携带cookie, 但是在跨域情况,默认是不会携带请求域cookie的, 比如
http://domain-a.com 站点发送一个请求到http://domain-b.com/get的请求,默认不会带cookie;
如果相带，只需要设置xhr对象的withCredentials为true;

注意: http://domain-b.com/get在这个域名下种下cookie


2. XSRF防御

防御手段: 比如验证请求的referer, 但是referer可以伪造; 服务端通过token

自动做几件事: 从cookie中读取对应的token值, 然后添加到请求的header中; xsrfCookieName: 存储token的cookie名称 和xsrfHeaderName: token对应的header名称

```ts
axios.get('/more/get', {
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
}).then(res => {
  console.log(res)
})
```

做三件事:
- 首先判断如果配置withCredentials为true或者是同域请求,我们才会请求的headers添加响应的字段
```ts
// 写这段代码的原因在于巧用a标签 
const usrParsingNode = document.createElement('a');
const currentOrigin = resolveURL(document.location.href);
function resolveURL(url: string): URLOrigin{
  usrParsingNode.setAttribute("href", url);
  const {protocol, host} = usrParsingNode;
  return {protocol, host}
}

```
- 如果判断成功,尝试从cookie中读取xsrf的值
- 如果能读到,则把它添加到请求headers的xsrf相关字段中


> 上传和下载监控

上传文件或者请求一个大体积数据的时候, 甚至需要知道进度条显示, onDownloadProgress
onUploadProgress两个函数属性

XMLHttpRequest.upload 属性返回一个 XMLHttpRequestUpload对象;用来表示上传的进度
上传类型为formData类型,删除headers Content-type字段

```ts
  if(isFormData(data)){
    delete headers['Content-Type']
  }
```

重构xhr: 模块化

nprogress库显示进度条  按装包和types 

上传api 需要connect-multiparty中间件

> http授权

http协议中的Authorization请求header会包含用于验证用户的身份凭证，通常会在服务器401 Unadthorized状态码
已经www-authticate消息头之后在后续的请求中发送此消息头
https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication

atob() btoa 加解码

> 合法状态码

认为http status在200~300之间是合法值,在这区间之外是错误, 解决304是一个正常嘛的问题
validateStatus()

> 自定义参数序列化
提供一个paramsSerializer 函数来自定义params的解析规则
```ts
paramsSerializer(params) {}
```

需要解决params 为URLSearchParams

> baseURL

> 实现axios.all、axios.spread等方法

axios.all 就是Promise.all的封装, 返回的是一个Promise数组


### 单元测试
Jest支持typescript项目测试，需要先在项目中安装如下依赖
{
    // ...
    "scripts": {
        "build": "tsc",
        "test": "jest",
        "test-cov": "jest --coverage"
    },
    "jest": {
        "testEnvironment": "node"
    },
    // ...
}
npm install -D jest ts-jest @types/jest

升级jest @types/jest jest-config ts-jest  typescript

> jest配置

```ts
  "jest": {
    "transform": {
      ".(ts|tsx)": "ts-jest"
    },
    "testEnvironment": "jsdom",
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js"
    ],
    "coveragePathIgnorePatterns": [
      "/node_modules/",
      "/test/"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 90,
        "functions": 95,
        "lines": 95,
        "statements": 95
      }
    },
    "collectCoverageFrom": [
      "src/*.{js,ts}",
      "src/**/*.{js,ts}"
    ]
  },
```

transform: 转化器 .ts .tsx转换成javascript;
testEnvironment: The test environment that will be used for testing
testRegex: 要测试的文件正则表达式 test目录下.test.ts 和.spec.ts 
moduleFileExtensions: 模块文件测试名
coveragePathIgnorePatterns: 
coverageThreshold: 测试覆盖率
collectCoverageFrom: 收集指定文件覆盖率 
setupFilesAfterEnv: 

> 测试工具函数
1. 在test下创建helpers和boot; npm test 执行测试
测试的时候 不想实现

"testEnvironment": "jsdom", FormData 要使用浏览器的dom元素

请求模块单元测试
请求模块是axios基础模块, 通过一个axios方法发送Ajax请求

jasmine-ajax: 拦截所有的ajax的请求

getJasmineRequireObj is not defined
发送xhr 就能拦截
```ts
// 解决问题的方法
var JasmineCore = require("jasmine-core");
// @ts-ignore
global.getJasmineRequireObj = function() {
    return JasmineCore;
};
```
expect(reason.request).toEqual(expect.any(XMLHttpRequest))
expect.any(XMLHttpRequest) 任由XMLHttpRequest 构造的实例

// @ts-ignore 测试timeout
request.eventBus.trigger('timeout')
```js
  // done() 说明it整个执行就完了
  it("should reject when request timeout", done =>{
    let err: AxiosError

    axios('/foo', {
      timeout: 2000,
      method: 'post'
    }).catch(error => {
      err = error
    })
    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')
      setTimeout(() => {
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toBe('Timeout of 2000 ms exceeded')
        done()
      }, 100)
    })
  }) 
```

### ts-axios编译与发布
1. 注册npm
2. 编译打包: 利用rollup来打包ts-axios, vue.js 也是利用rollup打包的, 
修改rollup.config.json; 适合打包和编译一些js库
```js
  const libraryName = 'axios'
  // Compile TypeScript files，使用tsconfig declarationDir文件
  typescript({ useTsconfigDeclarationDir: true }),
```
修改package.json
```js
  "main": "dist/axios.umd.js",
  "module": "dist/axios.es5.js",
```
3. 自动化部署:
自己写

4. 修改package

查询名字是否已经使用: npm view [<@scope>/]<pkg>[@version] 方式搜索
一个报名已经存在, npm view ts-axios-new

如果你想让你发布的包关联你的仓库地址: repository, url

另外我们增加2个npm scripts: npm 规则 先执行 pre操作
{
  "prepub": "npm run test:prod && npm run build",
  "pub": "sh release.sh"
}
运行: npm run pub
会先去执行: pre的操作，script的规则   
// 解决问题 cancelToken 的问题
```js
cancelToken.promise.then(reason => {
  request.abort()
  reject(reason)
}).catch(
  // 忽略测试
  /* istanbul ignore next */ 
  () => {
    // do nothing
  })
```
import的时候先找package module, 在找main