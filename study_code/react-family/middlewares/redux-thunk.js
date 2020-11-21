/**
 * @file redux中间件
 */

function createThunkMiddleWare(extraArgument){
  return ({dispatch, getState}) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  }
}

const thunk = createThunkMiddleWare();
thunk.withExtraArgument = createThunkMiddleWare;
export default thunk;