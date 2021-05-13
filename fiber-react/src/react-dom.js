import {TAG_ROOT} from './constant';
import scheduleRoot from './schedule';

/**
 * render是要把一个元素渲染到一个内部
 */
function render(element, container) {
  debugger
  let rootFiber = {
    tag: TAG_ROOT, // 每个fiber会有一个tag标识, 此元素的类型
    stateNode: container, // 如果一个原生节点的话, stateNode指向真实DOM元素
    // props.children是一个数组, 里面放的是React元素，虚拟DOM后面会根据
    props: {
      children: [element]
    }
  };
  scheduleRoot(rootFiber);
}

const ReactDOM = {
  render
};

export default ReactDOM;