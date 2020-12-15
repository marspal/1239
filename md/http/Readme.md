## HTTP 学习研究记录

### api

- http.createServer([options][, requestListener]);

  返回新的 http.Server 实例。

  requestListener 是一个函数，会被自动添加到 'request' 事件。

  创建实例: 
```js
    function createServer(options, handler) {
        return http.createServer()
            .on('request', createRequestListener(options, handler));
    }
```