const store = createStore(reducer);
const next = store.dispatch;

store.dispatch = (action) => {
  try {
    next(action);
  } catch (err) {
    console.error('错误报告: ', err)
  }
}