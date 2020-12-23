
const applyMiddleware = function (...middlewares) {
  return function rewriteCreateStoreFunc(oldCreateStore) {
    return function newCreateStore(reducer, initState) {
      const store = oldCreateStore(reducer, initState);
      let dispatch = store.dispatch;
      var middlewareAPI = {
        // Q:
        dispatch: (action) => dispatch(action),
        getState: store.getState
      }
      const chain = middlewares.map(middleware => middleware(middlewareAPI));
      let dispatch = store.dispatch;
      chain.reverse().map(middleware => {
        dispatch = middleware(dispatch);
      });
      store.dispatch = dispatch;
      return store;
    }
  }
}