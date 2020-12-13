const store = createStore(reducer);
const next = store.dispatch;

/*重写了store.dispatch*/
store.dispatch = (action) => {
  console.log('this state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
}