function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  // 返回新的reducer, state 中的state
  return function newReducer(state, action){
    const nextState = {}
    // 遍历所有的子reducer
    for (let i = 0; i < reducerKeys.length; i++) {
      // 这里解释了state 子state key, reducers key要相同, 不同有什么效果? 
      const key = reducerKeys[i];
      const childReducer = reducers[key];
      const preChildState = state[key];
      const nextState = childReducer(preChildState, action);
      nextState[key] = nextState
    }
    return nextState;
  }
}