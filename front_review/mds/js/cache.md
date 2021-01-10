## 缓存专题

- cache-control、Expires所控制的缓存策略

- last-modified和etag以及整个服务端-浏览器端的缓存流程

- 案例分析和实战,基于node实践以上缓存方式

[缓存]("../images/缓存.png") 


### 实现途径 http header

简介: 浏览器只是一种缓存设备, 中间服务也可以当缓存设备
https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching_FAQ#Freshness
> Cache-control (Request、Response都有)
- max-age: max-age=315360000 在这个时间范围内读取缓存  
 表示资源能够被缓存（保持新鲜）的最大时间。相对Expires而言，max-age是距离请求发起的时间的秒数
- s-maxage: 和max-age一样,作用于public的 cdn (public的缓存设备); 优先级大于max-age
  s-maxage: 要去public去取缓存, cdn 的缓存时间
- private: 这种情况就是只有浏览器能缓存了，中间的代理服务器不能缓存
- public: 客户端和代理服务器都可以缓存, 因为一个请求可能要经过不同的代理服务器最后才到达目标服务器，那么结果就是不仅仅浏览器可以缓存数据，中间的任何代理节点都可以进行缓存;
- no-cache: private, max-age=0,no-cache; 发起请求, max-age不发; 跳过当前的强缓存，发送HTTP请求，即直接进入协商缓存阶段;
- no-store: 不使用缓存
- Age 记录过了多少时间; Age的值通常接近于0。表示此对象刚刚从原始服务器获取不久;表示此对象刚刚从原始服务器获取不久；其他的值则是表示代理服务器当前的系统时间与此应答中的通用头 Date 的值之差。s-maxage回去走cdn 缓存策略; 得去请求 

> Expires

- 缓存过期时间,用来指定资源到期的时间, 是服务器端的具体时间点;
- 告诉浏览器在过期时间前浏览器可以直接从浏览器缓存取数据,而无需在此请求;


> Last-modified/If-Modified-Since
- 基于客户端和服务端协商的缓存机制;
- last-modified ---- response header;
- If-Modified-Since ---- request header
- 需要与cache-control共同使用 

缺点:
- 某些服务端不能获取精准的修改时间
- 文件修改时间改了, 但文件内容没有变


> Etag/ If-None-Match
- 文件内容的hash值
- Etag: response header
- If-None-Match: request header
- 需要与cache-control共同使用

> [分级缓存策略]("../images/分级缓存策略.png");


> 浏览器的缓存位置 优先级从高~低
- service worker
- Memory cache
- Disk Cache
- Push Cache

1. service worker
Service Worker 借鉴了Web Worker的思路，
即让 JS 运行在主线程之外，由于它脱离了浏览器的窗体，
因此无法直接访问DOM。虽然如此，但它仍然能帮助我们完成很多有用的功能，
比如离线缓存、消息推送和网络代理等功能。其中的离线缓存就是 Service Worker Cache。
