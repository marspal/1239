/**
 * @file: redux-thunk
 * @description: Thunk函数实现上就是针对多参数的curring以实现对函数的惰性求值
 */
import thunkMiddleware from '../../../react-family/middlewares/redux-thunk';
let doDispatch, doGetState, nextHandler;
describe('redux-thunk middleware', () => {
  beforeEach(() => {
    doDispatch = () => {};
    doGetState = () => {};
    nextHandler = thunkMiddleware({dispatch: doDispatch, getState: doGetState})
  });
  it('must return a function to handle next', () => {
      expect(typeof nextHandler).toBe('function');
      expect(nextHandler.length).toBe(1);
  });
  describe("handle next", () => {
    it('must return a function to handle action', () => {
      const actionHandler = nextHandler();
      expect(typeof actionHandler).toBe('function');
      expect(actionHandler.length).toBe(1);
    });
    describe('handle action', () => {
      it('must run the given action function with dispatch and getState', (done) => {
        const actionHandler = nextHandler();
        actionHandler((dispatch, getState) => {
          expect(dispatch).toBe(doDispatch);
          expect(getState).toBe(doGetState);
          done();
        });
      });
      it('must pass action to next if not a function', done => {
        const actionObj = {};
        const actionHandler = nextHandler(action => {
          expect(action).toBe(actionObj);
          done();
        });
        actionHandler(actionObj)
      });
      it('must return the return value of next if not a function', () => {
        const expected = 'redux';
        const actionHandler = nextHandler(() => expected);
        const outcome = actionHandler();
        expect(outcome).toBe(expected);
      });
      it('must return value as expected if a function', () => {
        const expected = 'rocks';
        const actionHandler = nextHandler();

        const outcome = actionHandler(() => expected);
        expect(outcome).toBe(expected);
      });
      it('must be invoked synchronously if a function', () => {
        const actionHandler = nextHandler();
        let mutated = 0;
        actionHandler(() => mutated++);
        expect(mutated).toBe(1)
      });
    })
  })
});

describe('handle errors', () => {
  it('must throw if argument is non-object', (done) => {
    try {
      thunkMiddleware();
    } catch (err) {
      done();
    }
  });
});

describe('withExtraArgument', () => {
  it('must pass the third argument', (done) => {
    const extraArg = { lol: true };
   thunkMiddleware.withExtraArgument(extraArg)({
    dispatch: doDispatch,
    getState: doGetState,
   })()((dispatch, getState, args) => {
     expect(dispatch).toBe(doDispatch);
     expect(getState).toBe(doGetState);
     expect(args).toBe(extraArg);
     done();
   })
  });
});