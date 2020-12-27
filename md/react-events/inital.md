## 事件初始化

react事件系统: 为了实现event夸平台, react实现了自己的事件系统;在引入react-dom时候就执行了事件模块的初始化;
在ReactDOM的入口文件，里面有这么一句代码：import './ReactDOMClientInjection';

> ReactDOMClientInjection调用两个重要的方法
- injectEventPluginOrder
- injectEventPluginsByName

向事件系统注入了平台相关的事件代码, 同时确定事件调用顺序;
上述两个方法来自于legacy-events/EventPluginRegistry

injectEventPluginOrder: 设置plugin顺序,存放于eventPluginOrder
injectEventPluginsByName: 设置namesToPlugins,存放Plugin

plugin: SimpleEventPlugin、EnterLeaveEventPlugin、ChangeEventPlugin、SelectEventPlugin、BeforeInputEventPlugin

```js
  // plugin构成
  const ChangeEventPlugin = {
    eventTypes,
    extractEvents: function(
      topLevelType,
      targetInst,
      nativeEvent,
      nativeEventTarget,
    ){}
  }
  // eventTypes [key: string] 为原生事件
  const eventTypes = {
    change: {
      phasedRegistrationNames: {
        bubbled: 'onChange',
        captured: 'onChangeCapture',
      },
      _isInputEventSupported, // ?作用是啥
      dependencies: [
        TOP_BLUR, // 原生事件
      ]
    }
  }
```
eventTypes是以原生事件为key的map对象，map中的phasedRegistrationNames是组件props的名字如onChange; dependencies是如果需要绑定change事件需要同时绑定哪些事件;

extractEvents是一个方法，用来根据具体真实触发的事件类型等参数，返回对应的事件对象，也可以返回null表示当前事件跟这个插件没有关系。


> legacy-events/EventPluginRegistry

四个导出对象: plugins、eventNameDispatchConfigs， registrationNameModules、registrationNameDependencies

通过injectEventPluginOrder、injectEventPluginsByName方法后求出了上述四个对象的值; 四个对象主要作用的是原生事件和React事件对应关系; 以及React事件和Plugin对应关系

注意: 在 ES6 module 中,基本类型变量都是引用关系,所以很容易修改变量值;

- 调用injectEventPluginOrder, 设置eventPluginOrder,eventPluginOrder是DOMEventPluginOrder的一个copy;
```js
const DOMEventPluginOrder = [
  'ResponderEventPlugin',
  'SimpleEventPlugin',
  'EnterLeaveEventPlugin',
  'ChangeEventPlugin',
  'SelectEventPlugin',
  'BeforeInputEventPlugin',
];
```
- 调用injectEventPluginsByName: 注册除ResponderEventPlugin的5个plugin;

把所有插件加入到namesToPlugins对象中，key对应的插件名称; 

- 调用recomputePluginOrdering

  把插件按顺序插入到plugins;并对每个插件中的eventTypes中的每个事件类型调用publishEventForPlugin;

- 调用publishEventForPlugin
- 设置eventNameDispatchConfigs对象，以事件名为key存储dispatchConfig，也就是上面插件中的eventTypes.change对应的对象

- 对每一个phasedRegistrationNames里面的项执行publishRegistrationName，设置registrationNameModules，以事件名registrationName为存储模块，同时设置registrationNameDependencies，以事件名为registrationName存储事件的dependencies

注意：registrationNameModules在更新 DOM 节点的时候会被用到，registrationNameDependencies在绑定事件的使用会被用到。

整个注册过程就是为了初始化设置这些变量，这些变量在后续的 DOM 操作中会扮演比较重要的角色。

```js
// eventNameDispatchConfigs 
{
  change: ChangeEventPlugin.eventTypes.change,
  ...
}
// registrationNameModules
{
  onChange: ChangePlugin,
  onChangeCapture: ChangePlugin
}
// registrationNameDependencies
{
  onChange: ChangePlugin.eventTypes.change.dependencies,
  onChangeCapture: ChangePlugin.eventTypes.change.dependencies
}
```






