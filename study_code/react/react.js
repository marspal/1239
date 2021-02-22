/* eslint-disalbe */

// todo scheduler package 实现了requestIdleCallback
// todo 事件的绑定
// 创建ReactElement: element
// element: ReactElements node: Dom Elements
// render is where React changes the DOM, so let's do the update ourselves

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'object'
          ? child
          : createTextElement(child);
      })
    }
  };
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  }
  deletions = [];
  nextUnitOfWork = wipRoot;
}
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      children: [],
      nodeValue: text
    }
  }
}
  
let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null; // 保存最新一次提交
let deletions = null;

// 每一个element对应一个fiber
// 每一个fiber就是一个unit
function workLoop(deadline){
  let shouldYield = false;
  while(nextUnitOfWork && !shouldYield){
    // 执行work并且返回next unit of work
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  // commit The Tree
  if(!nextUnitOfWork && wipRoot){
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
  
let wipFiber = null;
let hookIndex = null;
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
  function useState(initial){
    const oldHook = 
      wipFiber.alternate &&
      wipFiber.alternate.hooks &&
      wipFiber.alternate.hooks[hookIndex];
    const hook = {
      state: oldHook? oldHook.state : initial,
      queue: []
    }
    const actions = oldHook ? oldHook.queue : [];
    actions.forEach(action => {
      hook.state = action(hook.state);
    })
    const setState = action => {
      hook.queue.push(action);
      wipRoot = {
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot
      }
      nextUnitOfWork = wipRoot;
      deletions = [];
    }
    wipFiber.hooks.push(hook);
    hookIndex ++;
    return [hook.state, setState]
  
  }
  function updateHostComponent(fiber){
    if(!fiber.dom){
      fiber.dom = createDom(fiber);
    }
    reconcileChildren(fiber, fiber.props.children);
  }
  function performUnitOfWork(fiber){
    // TODO add dom node
    // TODO create new fibers
    // TODO return unit of work
    const isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent){
      updateFunctionComponent(fiber);
    } else {
      updateHostComponent(fiber);
    }
    if(fiber.child){
      return fiber.child;
    }
    let nextFiber = fiber;
    while(nextFiber){
      if(nextFiber.sibling){
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }
  }
  
  function createDom(fiber){
    const dom = fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
    updateDom(dom, {}, fiber.props);
    return dom;
  }
  // Reconciliation
  function commitRoot(){
    deletions.forEach(commitWork);
    commitWork(wipRoot.child); 
    // 任务结束后, 记录当前的渲染完成的fiber树
    currentRoot = wipRoot;
    wipRoot = null;
  }
  function commitWork(fiber){
    if(!fiber){
      return;
    }
    let domParentFiber = fiber.parent;
    while(!domParentFiber.dom){
      domParentFiber = domParentFiber.parent;
    }
    const domParent = domParentFiber.dom;
    if(fiber.effectTag === 'PLACEMENT' && fiber.dom != null){
      domParent.appendChild(fiber.dom);
    }else if(fiber.effectTag === 'DELETION'){
      // domParent.removeChild(fiber.dom);
      commitDeletion(fiber, domParent);
    } else if(
      fiber.effectTag === 'UPDATE'
      && fiber.dom != null
    ){
      updateDom(fiber.dom,fiber.alternate.props,fiber.props);
    }
    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }
  function commitDeletion(fiber, domParent){
    if(fiber.dom){
      domParent.removeChild(fiber.dom);
    }else{
      commitDeletion(fiber.child, domParent);
    }
  }
  function reconcileChildren(wipFiber, elements){
    let index = 0;
    let preSibling = null;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    while(index < elements.length || oldFiber != null){
      const element = elements[index];
      let newFiber = null;
      // TODO compare oldFiber to the element
      const sameType = oldFiber && element && element.type == oldFiber.type;
      if(sameType){
        // TODO update the node
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          parent: wipFiber,
          alternate: oldFiber, // TODO？
          effectTag: 'UPDATE'
        };
      }
      if(element && !sameType){
        // TODO add this node
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: wipFiber,
          alternate: null, // TODO？
          effectTag: 'PLACEMENT',
  
        };
      }
      if(oldFiber && !sameType){
        // TODO delete the oldFiber's node
        oldFiber.effectTag = 'DELETION';
        deletions.push(oldFiber);
      }
      if(oldFiber){
        oldFiber = oldFiber.sibling;
      }
      if(index === 0){
        wipFiber.child = newFiber;
      }else if(element){
        preSibling.sibling = newFiber;
      }
      preSibling = newFiber;
      index ++;
    }
  }
  const isEvent = key => key.startsWith("on");
  const isProperty = key => key !== 'children' && !isEvent(key);
  const isNew = (prev, next) => key => prev[key] !== next[key];
  const isGone = (prev, next) => key => !(key in next);
  // 
  const registrationNameModules = {};
  function enqueuePutListener(dom, registrationName, listener){
    // todo
    let doc = dom.ownerDocument;
    listenerTo(registrationName, doc);
    enqueue(putListener, {
      inst: dom,
      registrationName,
      listener
    });
  }
  function listenerTo(registrationName, contentDocumentHandle){
    var mountAt = contentDocumentHandle;
    var listeningSet = getListeningForDocument(mountAt);
    if(true){ // 冒泡处理
      trapBubbleEvent();
    }else{
      trapCaptureEvent();
    }
  }
  function updateDom(dom, prevProps, nextProps){
    // Remove old properties or changed event listeners
    Object.keys(prevProps)
      .filter(isEvent)
      .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
      })
    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone(prevProps, nextProps))
      .forEach(name => {
        dom[name] = "";
      })
    // set new or changed properies
    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        dom[name] = nextProps[name];
      });
    // Add event listeners
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        if(registrationNameModules.hasOwnProperty(name)){
          enqueuePutListener(dom, name, nextProps[name]);
        }
        // const eventType = name.toLowerCase().substring(2);
        // dom.addEventListener(eventType, nextProps[name]);
      })
    
  }
const Didact = {
  createElement,
  render,
  useState
};
  
  /**@jsx Didact.createElement */
  const element = (
    <div style="background: salmon">
      <h1>Hello World</h1>
      <h2 style="text-align:right">from Didact</h2>
    </div>
  );
  /**@jsx Didact.createElement */
  function App(props){
    return <h1>Hi {props.name}</h1>
  }
  /**@jsx Didact.createElement */
  function Counter() {
    const [state, setState] = Didact.useState(1);
    const [other, setOther] = Didact.useState(2);
    return(
      <div>
        <h1 onClick={() => setState(c => c + 1)}>
          Count: {state}
        </h1>
        <h1 onClick={() => setOther(c => c + 1)}>
          Count: {other}
        </h1>
      </div>
    );
  }
  const container = document.getElementById("root");
  Didact.render(<App name="123"/>, container);
  