// React.createElement(
//   "h1",
//   null,
//   React.createElement("a", null, "aa"), 
//   React.createElement("a", null, "sss")
// );
function createElement(type, props, ...children){
  delete props.__source;
  return {
    type,
    props: {
      ...props,  
      children: children.map(child => {
        return typeof child === 'object'? child : createTextElement(child)
      })
    },
    base: currentRoot
  }
}

/**
 * 
 * @param {*} text 
 * @param {*} 
 */
function createTextElement(text){
  return {
    type: 'TEXT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}
function createDom(vdom){
  const dom = vdom.type ==="TEXT" ? 
    document.createTextNode("")
    :document.createElement(vdom.type);
  updateDom(dom, {},vdom.props);
  return dom;
}
function updateDom(dom, prevProps, nextProps){
  //1. 规避children属性
  //2. 老的存在取消
  //3. 新的存在 新增  没有做新老相等的判定
  //4. todo 兼容性
  Object.keys(prevProps)
    .filter(name =>name !== 'children')
    .filter(name => !(name in nextProps))
    .forEach(name => {
      if(name.slice(0, 2) === 'on'){
        dom.removeEventListener(name.slice(0,2).toLowerCase(), prevProps[name], false)
      }else{
        dom[name] = '';
      }
    });
  Object.keys(nextProps)
  .filter(name => name !== "children")
  .forEach(name => {
    if(name.slice(0, 2) === 'on'){
      // onClick => click
      dom.addEventListener(name.slice(0,2).toLowerCase(),nextProps[name], false);
    }else{
      dom[name] = nextProps[name]
    }
  });
}
/**
 * 
 * @param {*} vdom 
 * @param {*} container 
 */
function render(vdom, container){
  // 初始化nextUnitOfWork
  wipRoot = {
    dom: container,
    props: {
      children: [vdom]
    }
  }
  nextUnitWork = wipRoot;
  deletions = [];
  // Object.keys(vdom.props)
  //   .filter(key => key !== 'children')
  //   .forEach(name => {
  //     // @todo 事件处理 属性兼容
  //     dom[name] = vdom.props[name]
  //   });
  // vdom.props.children.forEach(child => {
  //   render(child, dom);
  // });
  // container.appendChild(dom);
  // container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`;
}

function commitRoot(){
  deletions.forEach(commitWorker);
  commitWorker(wipRoot.child);
  // 先保存 
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWorker(fiber){
  if(!fiber){
    return;
  }
  // const domParent = fiber.parent.dom;
  // domParent.appendChild(fiber.dom);

  // 向上查找dom
  let domParentFiber = fiber.parent;
  while(!domParentFiber.dom){
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  if(fiber.effectTag === 'PLACEMENT' && fiber.dom !== null){
    domParent.appendChild(fiber.dom);
  }else if(fiber.effectTag === 'DELETION'){
    // domParent.removeChild(fiber.dom);
    commitDeletion(fiber, domParent);
  }else if(fiber.effectTag ==="UPDATE" && fiber.dom !== null){
    // 更新dom
    updateDom(fiber.dom, fiber.base.props, fiber.props);
  }
  commitWorker(fiber.child);
  commitWorker(fiber.sibling);
}

function commitDeletion(fiber, domParent){
  if(fiber.dom){
    domParent.removeChild(fiber.dom);
  }else{
    commitDeletion(fiber.child, domParent);
  }
}

// 下一个单元任务
// render 初始化第一个任务
let nextUnitWork = null;
let wipRoot = null;
// 保存中断前的节点
let currentRoot = null;
let deletions = null;
// 调度我们的diff或者渲染任务
// 有一个异步任务对列， 有一个nextunitofwork
function workloop(deadline){
  // 有一个单元任务, 并且当前帧还没有结束
  while(nextUnitWork && deadline.timeRemaining > 1){
    nextUnitWork = performUnitOfWork(nextUnitWork);
  }
  // 没有任务了; 并且根节点存在
  if(!nextUnitWork && wipRoot){
    commitRoot();
  }
  // 不停调用
  requestIdleCallback(workloop);
}

// 启动空闲时间渲染
window.requestIdleCallback(workloop);
function updateFunctionComponent(fiber){
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children);
}
function updateHostComponent(fiber){
  if(!fiber.dom){ 
    // 不是入口
    fiber.dom = createDom(fiber);
  }
  // 真实的dom操作
  // if(fiber.parent){
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }
  const elements = fiber.props.children;
  // 调和子元素
  reconcileChildren(fiber, elements);
}
function performUnitOfWork(fiber){
  // 判定是否为函数组件
  const isFunctionComponent = fiber.type instanceof Function;
  if(isFunctionComponent){
    updateFunctionComponent(fiber);
  } else {
    // dom
    updateHostComponent(fiber);
  }
  // 找下个任务
  // 先找子元素
  if(fiber.child){
    return fiber.child;
  }
  let nextFiber = fiber;
  while(nextFiber){
    if(nextFiber.sibling){
      return nextFiber.sibling;
    }
    // 没有兄弟元素找父元素
    nextFiber = newFiber.parent;
  } 
}
function reconcileChildren(wipFiber, elements){
  // 构建fiber结构
  let index = 0;
  let oldFiber = wipFiber.base && wipFiber.base.child;
  let preSibling = null;
  while(index < elements.length && oldFiber !== null){
    let element = elements[index];
    let newFiber = null;
    // const newFiber = {
    //   type: element.type,
    //   props: element.props,
    //   parent: wipFiber,
    //   dom: null
    // }

    // 对比oldfiber的状态和当前element
    // 先比较类型
    const sameType = oldFiber && element && oldFiber.type === element.type;
    if(sameType){ 
      // 复用节点更新
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        base: oldFiber,
        effectTag: 'UPDATE'
      }
    }

    if(!sameType && element){
      // 替换节点
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        base: null,
        effectTag: 'PLACEMENT'
      }
    }

    if(!sameType && oldFiber){
      // 删除
      oldFiber.effectTag = "DELETE"
    }

    if(oldFiber){
      oldFiber = oldFiber.sibling;
    }

    if(index === 0) {
      // 第一个元素, 是父Fiber的child属性
      wipFiber.child = newFiber;
    }else{
      preSibling.sibling = newFiber;
    }
    // 这行代码有问题?
    preSibling = wipFiber;
    index++;
    // 构建完成
  }
}

// fiber = {
//   dom: 真实dom,
//   parent: 父亲,
//   child: 子元素，
//   slibing: 兄弟
// }

// 构建dom可以被中断,操作dom一气呵成

export default {
  createElement,
  render
}
