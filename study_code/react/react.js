/**
 * @file build own React
 * @author andyxu
 * I:   createElement function
 * II:  render function
 * III: Concurrent Mode
 * IV:  Fibers
 * V:   Render and Commit Phases
 * VI:  Reconciliation
 * VII: Function Components
 * VIII: Hooks
 */

/**
 * todo:
 * 实现requestIdleCallback
 * 实现事件绑定
 * 实现class组件
 *
 * 说明:
 * element: 表示ReactElement
 * node:  Dom Elements
 */

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        if(typeof child === 'object'){
          return child;
        }
        return createTextElement(child);
      })
    }
  };
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

let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;
function workLoop(deadline) {
  let shouldYield = false;
  while(nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  // render commit 阶段
  if(!nextUnitOfWork && wipRoot){
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

// 以前使用requestAnimationFrame、后来使用
requestIdleCallback(workLoop);

let wipFiber = null;
let hookIndex = null;
function updateFunctionComponent(fiber){
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
function updateHostComponent(fiber){
  if(!fiber.dom){
    fiber.dom =createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

// 为每一个element创建一个fiber，fiber是一个unit of work
function performUnitOfWork(fiber){
  const isFunctionComponent = fiber.type instanceof Function;
  if(isFunctionComponent){
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  // 返回下一个执行单元
  if(fiber.child) {
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

function createDom(fiber) {
  const dom = fiber.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}

function commitRoot(){
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  deletions = [];
  wipRoot = null;
}

function commitDeletion(fiber, domParent){
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}
function commitWork(fiber){
  if(!fiber){
    return;
  }
  const domParentFiber = fiber.parent;
  while(!domParentFiber.dom){
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  if(fiber.effectTag === 'PLACEMENT' &&
    fiber.dom !== null
  ){
    domParent.appendChild(fiber.dom);
  } else if(fiber.effectTag === 'DELETION'){
    commitDeletion(fiber, domParent);
  } else if(fiber.effectTag === "UPDATE" &&
    fiber.dom !== null
  ){
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function reconcileChildren(wipFiber, elements){
  let index = 0;
  let preSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

  while(
    index < elements.length || 
    oldFiber !== null
    ) {
    const element = elements[index];
    let newFiber = null;
    const sameType = oldFiber
      && element
      && element.type === oldFiber.type;

    if(sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      };
    }
    if(element && !sameType){
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT'
      };
    }
    if(oldFiber && !sameType){
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }
    if(index === 0) {
      wipFiber.child = newFiber;
    } else {
      preSibling.sibling = newFiber;
    }
    preSibling = newFiber;
    index ++;
  }
}
const isEvent = key => key.startsWith("on")
const isProperty = key => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);
function updateDom(dom, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}

function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  }
  const setState = action => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
  }
  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}

const Didact = {
  createElement,
  render,
  useState
};