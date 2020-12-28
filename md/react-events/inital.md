## 事件初始化

react事件系统: 为了实现event夸平台, react实现了自己的事件系统;

### 文件加载-事件初始化
在引入react-dom时候就执行了事件模块的初始化;
在ReactDOM.js文件中，这句代码：import './ReactDOMClientInjection'意味着代码初始化开始了;


**在ReactDOMClientInjection文件**

调用了两个重要的方法:
- injectEventPluginOrder
- injectEventPluginsByName

上述两个方法来自于legacy-events/EventPluginRegistry

整个注册过程就是为了设置这些变量，这些变量在后续的 DOM 操作中会扮演比较重要的角色。

```
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
// plugins
plugins = [SimpleEventPlugin, EnterLeaveEventPlugin, ChangeEventPlugin, SelectEventPlugin, BeforeInputEventPlugin];
```

### 详细代码执行情况

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
injectEventPluginOrder作用是复制DOMEventPluginOrder, 存放于eventPluginOrder

```js
export function injectEventPluginOrder(
  injectedEventPluginOrder,
) {
  // 克隆顺序，使其无法动态更改。
  eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
  recomputePluginOrdering();
}
```

injectEventPluginsByName: 挂载每一个plugin与namesToPlugins; 并调用recomputePluginOrdering——核心方法

```js
// plugins有5种:
import BeforeInputEventPlugin from '../events/BeforeInputEventPlugin';
import ChangeEventPlugin from '../events/ChangeEventPlugin';
import EnterLeaveEventPlugin from '../events/EnterLeaveEventPlugin';
import SelectEventPlugin from '../events/SelectEventPlugin';
import SimpleEventPlugin from '../events/SimpleEventPlugin';
```

```js
export function injectEventPluginsByName(
  injectedNamesToPlugins
){
  let isOrderingDirty = false;
  for (const pluginName in injectedNamesToPlugins) {
    if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
      continue;
    }
    const pluginModule = injectedNamesToPlugins[pluginName];
    if (
      !namesToPlugins.hasOwnProperty(pluginName) ||
      namesToPlugins[pluginName] !== pluginModule
    ) {
      namesToPlugins[pluginName] = pluginModule;
      isOrderingDirty = true;
    }
  }
  if (isOrderingDirty) {
    recomputePluginOrdering();
  }
}
```

eventTypes是以原生事件为key的map对象，map中的phasedRegistrationNames是组件props的名字如onChange; dependencies是如果需要绑定change事件需要同时绑定哪些事件;

extractEvents是一个方法，用来根据具体真实触发的事件类型等参数，返回对应的事件对象，也可以返回null表示当前事件跟这个插件没有关系。

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


函数recomputePluginOrdering为核心函数:

- 把每一个plugin存入plugins
- 原生事件执行publishEventForPlugin;

```js
function recomputePluginOrdering(){
  if (!eventPluginOrder) {
    // Wait until an `eventPluginOrder` is injected.
    return;
  }
  for(const pluginName in namesToPlugins) {
    const pluginModule = namesToPlugins[pluginName];
    const pluginIndex = eventPluginOrder.indexOf(pluginName);
    if(plugins[pluginIndex]){
      continue;
    }
    plugins[pluginIndex] = pluginModule;
    const publishedEvents = pluginModule.eventTypes;
    // eventName原生事件
    for(const eventName in publishedEvents){
      publishEventForPlugin(
        publishedEvents[eventName], 
        pluginModule,
        eventName,
      )
    }
  }
}
```

调用函数:publishEventForPlugin(publishedEvents[eventName], pluginModule,
eventName)

- 把所有plugin中的eventTypes中的eventTypes.eventName存入eventNameDispatchConfigs: {}
eventNameDispatchConfigs = {
  change: {phasedRegistrationNames, dependencies},
  click: {phasedRegistrationNames, dependencies},
  ...more
}
- 对每一个合成事件执行publishRegistrationName, 注册每一个合成事件进入registrationNameModules,
registrationNameDependencies
```js
// pluginModule: 如:ChangeEventPlugin
// eventName: 原生事件
function publishEventForPlugin(
  dispatchConfig,
  pluginModule,
  eventName,
){

  eventNameDispatchConfigs[eventName] = dispatchConfig;

  const phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
  if (phasedRegistrationNames) {
    for (const phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        const phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistrationName(
          phasedRegistrationName,
          pluginModule,
          eventName,
        );
      }
    }
    return true;
  } else if (dispatchConfig.registrationName) {
    publishRegistrationName(
      dispatchConfig.registrationName,
      pluginModule,
      eventName,
    );
    return true;
  }
  return false;
}

function publishRegistrationName(
  registrationName,
  pluginModule,
  eventName,
) {
  registrationNameModules[registrationName] = pluginModule;
  registrationNameDependencies[registrationName] =
    pluginModule.eventTypes[eventName].dependencies;
}
```

四个导出对象: plugins、eventNameDispatchConfigs， registrationNameModules、registrationNameDependencies

通过injectEventPluginOrder、injectEventPluginsByName方法后求出了上述四个对象的值; 四个对象主要作用的是原生事件和React事件对应关系; 以及React事件和Plugin对应关系

注意: 在 ES6 module 中,基本类型变量都是引用关系,所以很容易修改变量值;

- 调用injectEventPluginOrder, 设置eventPluginOrder,eventPluginOrder是DOMEventPluginOrder的一个copy;

- 调用injectEventPluginsByName: 注册除ResponderEventPlugin的5个plugin;

把所有插件加入到namesToPlugins对象中，key对应的插件名称; 

- 调用recomputePluginOrdering

  把插件按顺序插入到plugins;并对每个插件中的eventTypes中的每个事件类型调用publishEventForPlugin;

- 调用publishEventForPlugin
- 设置eventNameDispatchConfigs对象，以事件名为key存储dispatchConfig，也就是上面插件中的eventTypes.change对应的对象

- 对每一个phasedRegistrationNames里面的项执行publishRegistrationName，设置registrationNameModules，以事件名registrationName为存储模块，同时设置registrationNameDependencies，以事件名为registrationName存储事件的dependencies

注意：registrationNameModules在更新 DOM 节点的时候会被用到，registrationNameDependencies在绑定事件的使用会被用到。








