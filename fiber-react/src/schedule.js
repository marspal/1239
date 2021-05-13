/**
 * 从根节点开始渲染和调度
 * 两个阶段:
 * diff阶段 对比新旧的虚拟DOM, 进行删除、更新或创建。
 * render阶段成果是effect list知道哪些节点更新了、知道那些节点删除了、那些节点增加了
 * 
 * render阶段两个任务: 1. 根据虚拟Dom生成fiber树 2. 收集effect list
 * commit阶段: 进行DOM更新创建阶段; 此阶段不能暂停,要一气呵成;
 */
import {
  ELEMENT_TEXT,
  PLACEMENT,
  DELETION,
  TAG_HOST,
  TAG_ROOT,
  TAG_TEXT,
  UPDATE
} from './constant';
import { setProps } from './utils';


let nextUnitOfWork = null; // 下一个工作单元
let workInProgressRoot = null; // 正在渲染的根fiber
let currentRoot = null; // 渲染成功后的树
let deletions = []; // 删除的节点并不放在effect list中; 单独记录并执行

function scheduleRoot(rootFiber){
  // 双缓冲机制
  if(currentRoot && currentRoot.alternate){
    workInProgressRoot = currentRoot.alternate; // 第一次渲染的那一棵树
    workInProgressRoot.props = rootFiber.props;
    workInProgressRoot.alternate = currentRoot;
  } else if(currentRoot){ // 至少已经渲染过一次
    rootFiber.alternate = currentRoot;
    workInProgressRoot = rootFiber;
  } else { // 第一次渲染
    workInProgressRoot = rootFiber;
  }
  workInProgressRoot.firstEffect = workInProgressRoot.lastEffect = workInProgressRoot.nextEffect = null;
  nextUnitOfWork = workInProgressRoot;
}

/**
 * 
 * @param {*} fiber 
 * 1. 创建真实DOM元素
 * 2. 创建子fiber
 */
function beginWork(fiber){
  if(fiber.tag === TAG_ROOT){
    updateHostRoot(fiber);
  } else if(fiber.tag === TAG_TEXT){
    updateHostText(fiber);
  } else if(fiber.tag === TAG_HOST){ // 元素DOM
    updateHost(fiber);
  }
}

function createDOM(fiber){
  if(fiber.tag === TAG_TEXT){
    return document.createTextNode(fiber.props.text);
  } else if(fiber.tag === TAG_HOST){
    let stateNode = document.createElement(fiber.type);
    updateDOM(stateNode, {}, fiber.props);
    return stateNode;
  }
}

// 为dom设置属性
function updateDOM(dom, oldProps, newProps){
  setProps(dom, oldProps, newProps);
}

function updateHostRoot(fiber){
  // [element] 先处理自己 如果是一个原生节点; 1.创建真实的DOM 2.创建子fiber
  let children = fiber.props.children;
  reconcileChildren(fiber, children);
}

function updateHostText(fiber){
  if(!fiber.stateNode){
    fiber.stateNode = createDOM(fiber);
  }
}

function updateHost(fiber){
  if(!fiber.stateNode){
    fiber.stateNode = createDOM(fiber);
  }
  let children = fiber.props.children;
  reconcileChildren(fiber, children);
}


function reconcileChildren(fiber, children){
  let index = 0;
  let prevSibling;
  let oldFiber = fiber.alternate && fiber.alternate.child;

  // 遍历我们的子虚拟DOM数组,为每个虚拟DOM元素创建Fiber
  while(index < children.length || oldFiber){
    let child = children[index];
    let newFiber; // 新的fiber
    const sameType = oldFiber && child && child.type === oldFiber.type;
    let tag;
    if(child && child.type === ELEMENT_TEXT){
      tag = TAG_TEXT;
    } else if(child && typeof child.type === 'string') {
      // 如果是字符串，那就是一个元素DOM节点
      tag = TAG_HOST;
    }
    if(sameType){
      newFiber = {
        tag: oldFiber.tag,
        type: oldFiber.type,
        props: child.props,
        stateNode: oldFiber.stateNode,
        return: fiber,
        alternate: oldFiber,
        effectTag: UPDATE,
        nextEffect: null
      };
    } else if(!sameType && child) {
      newFiber = {
        tag,
        type: child.type,
        props: child.props,
        stateNode: null, // div还没创建DOM元素
        return: fiber,
        effectTag: PLACEMENT, // 副作用标识: 增 删 更新
        nextEffect: null, // effect list也是一个单链表
      };
    } else if(!sameType && oldFiber){
      oldFiber.effectTag = DELETION;
      deletions.push(oldFiber);
    }
    // 最小儿子没有弟弟
    if(index === 0){
      fiber.child = newFiber;
    } else {
      // 子fiber串联起来
      prevSibling.sibling = newFiber;
    }
    if(oldFiber){
      oldFiber = oldFiber.sibling;
    }
    prevSibling = newFiber;
    index ++;
  }
}

function performUnitOfWork(fiber){
  beginWork(fiber);
  if(fiber.child){
    return fiber.child;
  }
  let nextFiber = fiber;
  while(nextFiber){
    completeUnitOfWork(fiber); // 没有儿子让自己完成
    if(nextFiber.sibling){
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

// 在完成的时候收集有副作用的Effect, 然后组建成effect list
/**
 * 遍历链规则: 先太子、后弟弟、再叔叔
 * 完成链规则: 所有儿子完全成自己就完成
 * effect链: 等于完成链
 * 每个fiber有两个属性， firstEffect指向第一个副作用的子节点
 * lastEffect指向最后一个有副作用的子fiber
 * 中间用nextEffect做成一个单链表 firstEffect=大儿子， nextEffect二儿子
*/    
function completeUnitOfWork(fiber){
  let returnFiber = fiber.return;
  if(returnFiber){
    // 把儿子的effect连挂载到父亲身上
    if(!returnFiber.firstEffect){
      returnFiber.firstEffect = fiber.firstEffect;
    }

    if(returnFiber.lastEffect){
      if(returnFiber.lastEffect){
        returnFiber.lastEffect.nextEffect = fiber.firstEffect;
      }
      returnFiber.lastEffect = fiber.lastEffect;
    }
 
    // 吧自己挂载到父亲身上
    const effectTag = fiber.effectTag;
    if(effectTag){ // 有副作用
      if(returnFiber.lastEffect){
        returnFiber.lastEffect.nextEffect = fiber;
      } else {
        returnFiber.firstEffect = fiber; 
      }
      returnFiber.lastEffect = fiber;
    }
  }
}

// 循环执行工作nextUnitOfWork
function workLoop(deadline){
  let shouldYield = false;
  while(nextUnitOfWork && !shouldYield){
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if(!nextUnitOfWork && workInProgressRoot){
    console.log('render阶段结束');
    commitRoot();
  }
  // 不管有没有任务，都请求再次调度 每一帧都要执行一次workLoop
  requestIdleCallback(workLoop, {timeout: 5000});
}

function commitRoot(){
  deletions.forEach(commitWork);
  let currentFiber = workInProgressRoot.firstEffect;
  while(currentFiber){
    commitWork(currentFiber);
    currentFiber = currentFiber.nextEffect;
  }
  deletions.length = 0; // 提交后清空
  // 渲染结束后，赋值给currentRoot: 当前页面上的fiber树
  currentRoot = workInProgressRoot;
  workInProgressRoot = null;
}

function commitWork(fiber){
  if(!fiber) return;
  let returnFiber = fiber.return;
  let returnDOM = returnFiber.stateNode;
  if(fiber.effectTag === PLACEMENT){
    returnDOM.appendChild(fiber.stateNode);
  } else if(fiber.effectTag === DELETION){
    returnDOM.removeChild(fiber.stateNode);
  } else if(fiber.effectTag === UPDATE){
    if(fiber.type === ELEMENT_TEXT){
      if(fiber.alternate.props.text !== fiber.props.text){
        fiber.stateNode.textContent = fiber.props.text;
      }
    } else {
      updateDOM(fiber.stateNode, 
        fiber.alternate.props, fiber.props);
    }
  }
  fiber.effectTag = null;
}

// react告诉浏览器, 空闲的时候执行
// 优先级概念, expirationTime
requestIdleCallback(workLoop, {timeout: 5000});

export default scheduleRoot; 