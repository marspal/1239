## 事件绑定

事件绑定主要是初始化DOM事件，当然在 DOM 更新过程中也会出现，不过较少，所以我们就从初始化 DOM 的时候入手来讲。在初始化的时候我们会调用一个方法叫做setInitialProperties，这里一开始就对一些类型的节点执行了一些事件绑定;

ReactFiberCompelteWork.js

执行到completeWork时候,HostComponent: 调用finalizeInitialChildren; 

// ReactDOMHostConfig.js
- finalizeInitialChildren: 调用setInitialProperties

- setInitialProperties
作用: 一部分事件:trapBubbledEvent绑定到对应的dom节点, 调用setInitialDOMProperties: 作用传入的props和dom attributes对应关系的方法；setInitialDOMProperties关键代码如下

```js
else if (registrationNameModules.hasOwnProperty(propKey)) {
  if (nextProp != null) {
    ensureListeningTo(rootContainerElement, propKey);
  }
}
```

调用ensureListeningTo; 只绑定可以冒泡的事件
```js
function ensureListeningTo(
  rootContainerElement: Element | Node,
  registrationName: string,
): void {
  const isDocumentOrFragment =
    rootContainerElement.nodeType === DOCUMENT_NODE ||
    rootContainerElement.nodeType === DOCUMENT_FRAGMENT_NODE;
  // 每一个新创建的host元素的ownerDocument指向docment
  const doc = isDocumentOrFragment
    ? rootContainerElement
    : rootContainerElement.ownerDocument;
  // registrationName: props中的onChange事件
  legacyListenToEvent(registrationName, doc);
}
```
调用legacyListenToEvent:
- 获取当前挂载点map对象
- 把registrationNameDependencies: dependencies注册到doc上, 

```js
export function  legacyListenToEvent(
  registrationName: string,
  mountAt: Document | Element | Node,
): void {
  // 获取当前挂载点Map
  const listenerMap = getListenerMapForElement(mountAt);
  const dependencies = registrationNameDependencies[registrationName];

  for (let i = 0; i < dependencies.length; i++) {
    const dependency = dependencies[i];
    legacyListenToTopLevelEvent(dependency, mountAt, listenerMap);
  }
}
```
- getListenerMapForElement

```js
// elementListenerMap 使用new WeakMap提升效率, 因为只用到了get， set操作
// elementListenerMap: {document: new Map(), div: new Map()}
elementListenerMap = new WeakMap();

```
```js
function getListenerMapForElement(
  element
){
  let listenerMap = elementListenerMap.get(element);
  if (listenerMap === undefined) {
    listenerMap = new Map();
    elementListenerMap.set(element, listenerMap);
  }
  return listenerMap;
}
```

- 调用legacyListenToTopLevelEvent
判断listenerMap中是否挂载dependency(原生事件),没有的话 则挂载dependency; 并新增于listenerMap; default就是冒泡在方法trapBubbledEvent: document事件上; 有的事件挂载在目标dom元素; 如reset、submit、invalid; 有的事件capture阶段挂载上trapCapturedEvent； mediaEventTypes媒体事件setInitialProperties在这里已经挂载上了;
```js
// topLevelType: 为原生事件
// dependency, mountAt, listenerMap
// legacyListenToTopLevelEvent(dependency, mountAt, listenerMap);
function legacyListenToTopLevelEvent(
  topLevelType,
  mountAt,
  listenerMap
) {
  if (!listenerMap.has(topLevelType)) {
    switch (topLevelType) {
      case TOP_SCROLL:
        trapCapturedEvent(TOP_SCROLL, mountAt);
        break;
      case TOP_FOCUS:
      case TOP_BLUR:
        trapCapturedEvent(TOP_FOCUS, mountAt);
        trapCapturedEvent(TOP_BLUR, mountAt);
        // We set the flag for a single dependency later in this function,
        // but this ensures we mark both as attached rather than just one.
        listenerMap.set(TOP_BLUR, null);
        listenerMap.set(TOP_FOCUS, null);
        break;
      case TOP_CANCEL:
      case TOP_CLOSE:
        if (isEventSupported(getRawEventName(topLevelType))) {
          trapCapturedEvent(topLevelType, mountAt);
        }
        break;
      case TOP_INVALID:
      case TOP_SUBMIT:
      case TOP_RESET:
        // We listen to them on the target DOM elements.
        // Some of them bubble so we don't want them to fire twice.
        break;
      default:
        // By default, listen on the top level to all non-media events.
        // Media events don't bubble so adding the listener wouldn't do anything.
        const isMediaEvent = mediaEventTypes.indexOf(topLevelType) !== -1;
        if (!isMediaEvent) {
          trapBubbledEvent(topLevelType, mountAt);
        }
        break;
    }
    listenerMap.set(topLevelType, null);
  }
}
```

## 文件: ReactDOMEventListener.js 两个方法

- trapCapturedEvent
- trapBubbledEvent

这两个方法都是调用: trapEventForPluginEventSystem, 区别capture第三个参数true false
- trapEventForPluginEventSystem
```js
// boolean trapCapturedEvent: true, trapBubbledEvent: false
trapEventForPluginEventSystem(element, topLevelType, boolean);
```

- 调用addEventCaptureListener
container: element 挂载点
listener: dispatchEvent.bind() 
```js
// addEventCaptureListener(container, rawEventName, listener);
// addEventBubbleListener(container, rawEventName, listener);
```


```js
// 到这里监听结束
export function addEventBubbleListener(
  element
  eventType,
  listener,
){
  element.addEventListener(eventType, listener, false);
}

export function addEventCaptureListener(
  element,
  eventType,
  listener,
) {
  element.addEventListener(eventType, listener, true);
}
```



