let state = {
  counter: {
    count: 0
  },
  info: {
    name: 'redux',
    description: 'redux从0到1'
  }
}

const reducer = combineReducers({
  counter: counterReducer,
  info: InfoReducer
});

let store = createStore(reducer, state);

store.subscribe(() => {
  let state = store.getState();
  console.log(state.counter.count, state.info.name, state.info.description);
});
/*自增*/
store.dispatch({
  type: 'INCREMENT'
});

/*修改 name*/
store.dispatch({
  type: 'SET_NAME',
  name: 'redux完全理解'
});

/*counterReducer, 一个子reducer*/
function counterReducer(state, action) {
  // state === state.counter
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state;
  }
}
/*InfoReducer，一个子reducer*/
function InfoReducer(state, action) {
  // state === state.info
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.name
      }
    case 'SET_DESCRIPTION':
      return {
        ...state,
        description: action.description
      }
    default:
      return state;
  }
}