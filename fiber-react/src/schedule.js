/**
 * 从根节点开始渲染和调度
 * 两个阶段:
 * render阶段: diff过程 对比新旧的虚拟DOM, 进行删除、更新或创建
 * 结果是effect list; 知道那些节点删除了、那些节点增加了
 * commit阶段: 进行DOM更新创建阶段 
 */
import {ELEMENT_TEXT, PLACEMENT, TAG_HOST, TAG_ROOT, TAG_TEXT} from './constant';
import { setProps } from './utils';
let nextUnitOfWork = null;
let workInProgressRoot = null;

function scheduleRoot(fiber){
  nextUnitOfWork = fiber;
  workInProgressRoot = fiber;
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

function updateDOM(dom, oldProps, newProps){
  setProps(dom, oldProps, newProps);
}

function updateHostRoot(fiber){
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

  // 遍历我们的子虚拟DOM数组,为每个虚拟DOM元素创建Fiber
  while(index < children.length){
    let child = children[index];
    let tag;
    if(child.type === ELEMENT_TEXT){
      tag = TAG_TEXT;
    } else if(typeof child.type === 'string') {
      tag = TAG_HOST;
    }
    let newFiber = {
      tag,
      type: child.type,
      props: child.props,
      stateNode: null, // div还没创建DOM元素
      return: fiber,
      effectTag: PLACEMENT, // 副作用标识: 增删查
      nextEffect: null, // effect list也是一个单链表
      // effect list顺序和完成的顺序是一样的, ☞放入修改的节点
    };
    // 最小儿子没有弟弟
    if(index === 0){
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
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
    completeUnitOfWork(fiber);
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
    if(!returnFiber.firstEffect){
      returnFiber.firstEffect = fiber.firstEffect;
      returnFiber.lastEffect = fiber.lastEffect;
    }
    if(re){

    }
    const effectTag = fiber.effectTag;
    if(effectTag){
      if(returnFiber.lastEffect){
        returnFiber.lastEffect.nextEffect = fiber;
      } else {
        returnFiber.firstEffect = fiber; 
      }
      returnFiber.lastEffect = fiber;
    }
  }
}

function workLoop(deadline){
  let shouldYield = false;
  while(nextUnitOfWork && !shouldYield){
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if(!nextUnitOfWork){
    console.log('render阶段结束');
  }
  requestIdleCallback(workLoop, {timeout: 5000});
}

// react告诉浏览器, 空闲的时候执行
// 优先级概念, expirationTime
requestIdleCallback(workLoop, {timeout: 5000});

export default scheduleRoot; 