/**
 * <h1 title="foo">
 *   Kaikeba
 *   <p id="123">abc</p>
 * </h1>
 * React.createElement(
 *   "h1", 
 *   {title: "foo"}, 
 *  "Kaikeba",
 *   React.createElement(
 *   "p",
 *    {id: "123"},
 *    abc
 *   )
 * )
 * 
 * var a = {
 *    type: 'h1',
 *    props: {
 *      title: "foo",
 *      children: [
 *         {type: 'TEXT', props: {nodeValue: 'Kaikeba', children: []}},
 *        {
 *          type: 'p', 
 *          props: {
 *            id: 123, 
 *            children: [
 *              {type: "TEXT", props: {nodeValue: "abc", children: []}}
 *            ]
 *         }
 *      ]
 *   }
 * }
 * 
 */
/** 
 * createElement: js描述真实dom元素 
 * const element ={
 *   type: h1,
 *   props: {
 *    title: "foo",
 *    children: "Kaikeba"
 *  }
 * }
 * 可以完整的描述dom,只需要频繁的操作的vdom,尽可能少操作这个而真实的dom
 * 
 * render就是遍历这个对象, 渲染dom即可, 这个后续会封装render函数,
 * 从jsx到element对象
 * 
 * const element = {
 *   type: "div",
 *   props: {
 *      id: "container",
 *      children: [
 *         {type: "input", props: {value: "fool", type: "text"}},
 *         {type: "a", props: {href: "/bar"}}
 *      ]
 *   }
 * }
 * fiber 架构是可以被中断
 * requestIdCallback 可以利用业余的时间,把任务划分, 如果当前任务来了(比如点击或者动画, 会先执行) , 然后空闲的时候, 在去完成没有完成的任务;
 * 原因: 递归的过程中 不可以中断
 * 问题1: 先去执行 怎么执行?  会不会有dom树 不一致的情况
 * 
 * fibers：
 * 之前的vdom结构是一个树形结构,没办法中断, 为了管理vdom树之间的关系, 我们需要把树形结构的内部关系
 * 改成链表(方便终止); 现在的关系是父亲 -> 子 子->父亲 子-> 兄弟 都有关系
 * 
 * 整个任务从render开始, 然后每一次都只是遍历一个小单元, 一但被打断就会取执行优先级高的任务(用户交互、动画)
 * 回来后 容易知道父子兄弟元素, 很容易回复遍历状态
 * fiber = {
 *  dom: ,
 *  parent: '',
 *  child: '',
 *  sibling
 * }
 * 
 * commit:
 * 我们给dom添加节点的时候, 如果在渲染的过程中, 被打断 UI变得很奇怪, 使用一个全局
 * 变量来存储正在工作的fiber跟节点 
 * 
 * 现在已经能渲染了, 但是如何更新和删除节点呢?
 * 我们需要保存一个被中断前的fiber节点, currentRoot, 以及每一个fiber都有一个字段 base 
 * 存储这上一个状态的 old fiber, 还需要调和子元素
 * 
 * 函数组件也是一样, 只不过要type是函数, 而不是字符串, 我们需要在处理vdom dom时有区别
 * 1. 根据type执行不同函数来初始化
 * 2. 函数组件没有dom属性(需要向上循环 查找) 
 *
 * hooks: hooks链表具体的找state 数组模拟一下把useState存储的hooks 存储在fiber中
*/
function createElement(type, props, ...children){
  // children: this.props.children
  delete props.__source
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'object'? child : createTextElement(child)
      })
    }
  }
}

/**
 * 文本类型的dom创建
 * @param text 
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

// 抽离相关的dom操作, 新建dom
function createDom(vdom){
  const dom = vdom.type === "TEXT"
  ?document.createTextNode('') 
  :document.createElement(vdom.type);
  // 设置属性
  updateDom(dom, {}, vdom.props);
  return dom;
}
function updateDom(dom, prevProps, nextProps){
  /**
   * 1. 规避children属性
   * 2. 老的存在 取消
   * 3. 新的存储 新增, 并没有去做新老相等的判定
   * 4. @todo 兼容性问题
   */

  Object.keys(prevProps)
    .filter(name => name !== 'children')
    .filter(name => !(name in nextProps))
    .forEach(name => {
      if(name.slice(0,2) === 'on'){
        // onClick => click'
        dom.removeEventListener(name.slice(2).toLowerCase(), prevProps[name], false);
      }else{
        dom[name] = '';
      }});
  Object.keys(nextProps)
    .filter(name => name !== 'children')
    .forEach(name => {
      if(name.slice(0,2) === 'on'){
        // onClick => click'
        dom.addEventListener(name.slice(2).toLowerCase(), nextProps[name], false);
      }else{
        dom[name] = nextProps[name];
      }
    });
  
}
function render(vdom, container){
  // render 初始化第一个任务
  wipRoot = {
    dom: container,
    props: {
      children: [vdom]
    },
    base: currentRoot // 存储当前的fiber节点 
  }
  deletions = [];
  nextUnitOfWork = wipRoot;
  // vdom.props.children.forEach((child) => {
  //   render(child, dom);
  // })
  // // container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`
  // container.appendChild(dom);
}
// 下一个单元的任务, 由render初始化第一个任务
function commitRoot(){
  deletions.forEach(commitWorker)
  commitWorker(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}
function commitWorker(fiber){
  if(!fiber){
    return;
  }
  // 兼容函数组件, 函数组件没有dom
  
  let domParentFiber = fiber.parent;
  while(!domParentFiber.dom){
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom; 
  if(fiber.effectTag === 'PLACEMENT' && fiber.dom !== null){
    domParent.appendChild(fiber.dom);
  }else if(fiber.effectTag === "DELETE"){
    // domParent.removeChild(fiber.dom);
    commitDeletion(fiber, domParent);
  }else if(fiber.effectTag === 'UPDATE' && fiber.dom !== null){
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

let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null; // 当前的中断的根节点
let deletions = null;
// 调动我们的diff或者渲染任务
function workLoop(deadline){
  // 有下一个任务, 并且当前帧没有结束
  while(nextUnitOfWork && deadline.timeRemaining() > 1){
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  // 没有任务了, 但是wipRoot根节点还在
  if(!nextUnitOfWork && wipRoot){
    commitRoot();
  }
  // 当前帧结束时候 任务可能还在
  window.requestIdleCallback(workLoop);
}
// 问题1: 中断任务后 执行高优先级的任务 我是把执行权交出去; 之前是一个children 很难中断
window.requestIdleCallback(workLoop);


// 火车车厢 fiber就是一个 一个 vnode节点
function performUnitOfWork(fiber){
  console.log(fiber);
  const isFunctionComponent = fiber.type instanceof Function;
  if(isFunctionComponent){
    updateFunctionComponent(fiber);
  }else{
    updateHostComponent(fiber);
  }
  // 构建完成后找子元素
  if(fiber.child){
    return fiber.child
  }
  // 找兄弟元素
  let nextFiber = fiber;
  while(nextFiber){
    console.log("===", nextFiber);
    if(nextFiber.sibling){
      return nextFiber.sibling;
    }
    // 调回父元素
    nextFiber = nextFiber.parent;
  }
}
let wipFiber = null;
let hookIndex = null;

function useState(init){
  const oldHooks = wipFiber.base && wipFiber.base.hooks &&  wipFiber.base.hooks[hookIndex];
  const hook = {
    state: oldHooks ? oldHooks.state : init,
    queue: []
  };
  const actions = oldHooks ? oldHooks.queue : [];
  actions.forEach(action => {
    hook.state = action;
  });
  const setState = action => {
    hook.queue.push(action);
    // debugger;
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      base: currentRoot
    }
    nextUnitOfWork = wipRoot;
    deletions = [];
  }
  wipFiber.hooks.push(hook);
  hookIndex ++;
  return [hook.state, setState]
}
function updateFunctionComponent(fiber){
  wipFiber = fiber; // 正在工作的hook
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
function updateHostComponent(fiber){
  // 根据当前任务,获取下一个任务
  if(!fiber.dom){ // 当前的节点还没有dom节点, 不是入口
    fiber.dom = createDom(fiber);
  }
  // 真实的dom操作
  // if(fiber.parent){
  //   fiber.parent.dom.appendChild(fiber.dom)
  // }
  
  const elements = fiber.props.children;
  // 调和当前的子元素和fiber
  reconcileChildren(fiber, elements);
}
function reconcileChildren(wipFiber, elements){
  // 构建fiber结构
  let index = 0;
  let oldFiber = wipFiber.base && wipFiber.base.child;
  let preSibling = null;
  while(index < elements.length || oldFiber !== null){
  // while(index < elements.length){
    const element = elements[index];
    // const newFiber = {
    //   type: element.type,
    //   props: element.props,
    //   parent: wipFiber,
    //   dom: null
    // }
    let newFiber = null;
    // 对比oldFiber的状态和当前的elements
    // 先比较类型
    const sameType = oldFiber && element && oldFiber.type == wipFiber.type;
    if(sameType){
      // 复用节点 更新节点
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        base: oldFiber,
        effectTag: 'UPDATE',
      };
    }
    if(!sameType && element){
      // 新增
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        base: null,
        effectTag: 'PLACEMENT',
      };
    }
    if(!sameType && oldFiber){
      // 删除 怎么去删除?
      oldFiber.effectTag = 'DELETE';
      deletions.push(oldFiber);
    }
    if(oldFiber){
      oldFiber = oldFiber.sibling;
    }
    if(index === 0){
      wipFiber.child = newFiber;
    }else if(element){
      preSibling.sibling = newFiber;
      // preSibling = fiber 老师的
    }
    preSibling = newFiber;
    index++;
  }  
}


export default {
  createElement,
  render,
  useState
}

// 问题1: 新的fiber数怎么来
// 问题2: 旧的
