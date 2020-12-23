const createStore = (reducer, initState, rewriteCreateStoreFunc) => {
  /*如果有 rewriteCreateStoreFunc，那就采用新的 createStore */
  if(rewriteCreateStoreFunc){
     const newCreateStore =  rewriteCreateStoreFunc(createStore);
     return newCreateStore(reducer, initState);
  }
  /*否则按照正常的流程走*/
}

// 最终用法
const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware);
const store = createStore(reducer, initState, rewriteCreateStoreFunc);