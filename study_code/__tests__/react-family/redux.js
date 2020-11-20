/**
 * @file Redux 测试
 * @author xumingquan
 */
const {createStore, combineReducer, applyMiddleware} = require('../../react-family/redux');
const initState = {
    count: 1
};
const stateInfo = {
    message: 'andyxu'
};

const ADD_TODO = 'ADD_TODO';

function addTodo(text) {
    return {type: ADD_TODO, text};
}
function id(state) {
    return state.reduce((result, item) => (item.id > result ? item.id : result), 0) + 1;
}
function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return [
                ...state,
                {
                    id: id(state),
                    text: action.text
                }
            ];
        default:
            return state;
    }
}
/** 中间件 */
function thunk({dispatch, getState}) {
    return next => action => typeof action === 'function' ? action(dispatch, getState) : next(action);
}

function changeCountReducer(state = initState, action) {
    switch (action.type) {
        case 'INCREMENT':
            return {
                ...state,
                count: state.count + 1
            };
        case 'DECREMENT':
            return {
                ...state,
                count: state.count - 1
            };
        default:
            return state;
    }
}
function infoReducer(state = stateInfo, action) {
    switch (action.type) {
        case 'CHANGE_NAME':
            return {
                ...state,
                message: action.message
            };
        default:
            return state;
    }
}
describe('Redux', () => {
    describe('redux createStore', () => {
        it('should return the initState', () => {
            const store = createStore(changeCountReducer, initState);
            expect(store.getState().count).toEqual(1);
        });
        it('should return the correct state after called the dispatch with param {type: "INCREMENT"}', () => {
            const store = createStore(changeCountReducer, initState);
            store.dispatch({type: 'INCREMENT'});
            expect(store.getState().count).toBe(2);
        });
        it('should count decrement minus 1 with {type: "DECREMENT"}', () => {
            const store = createStore(changeCountReducer, initState);
            store.dispatch({type: 'DECREMENT'});
            expect(store.getState().count).toBe(0);
        });
        it('listener should be called when change state', () => {
            const store = createStore(changeCountReducer, initState);
            const listener = jest.fn(() => {
                const state = store.getState();
                expect(state).toEqual(state);
            });
            store.subscribe(listener);
            store.dispatch({type: 'DECREMENT'});
            expect(listener).toHaveBeenCalled();
        });
        it('should work after use combineReducer', () => {   
            const reducer = combineReducer({
                counter: changeCountReducer,
                info: infoReducer
            });  
            const newInitState = {
                counter: initState,
                info: stateInfo
            };
            const store = createStore(reducer, newInitState);
            expect(store.getState().counter.count).toBe(1);
            expect(store.getState().info.message).toBe('andyxu');
    
            store.dispatch({
                type: 'INCREMENT'
            });
            expect(store.getState().counter.count).toBe(2);
            expect(store.getState().info.message).toBe('andyxu');
    
            store.dispatch({
                type: 'CHANGE_NAME',
                message: 'tomorrow will be fine!'
            });
            expect(store.getState().counter.count).toBe(2);
            expect(store.getState().info.message).toBe('tomorrow will be fine!');
        });
        it('should work without initial State', () => {
            const reducer = combineReducer({
                counter: changeCountReducer,
                info: infoReducer
            });
            const store = createStore(reducer);
            expect(store.getState()).not.toBeUndefined();
            store.dispatch({
                type: 'CHANGE_NAME',
                message: 'another example'
            });
            expect(store.getState().info.message).toBe('another example');
        });
        it('should work after spilting state', () => {
            const reducer = combineReducer({
                counter: changeCountReducer,
                info: infoReducer
            });
            const store = createStore(reducer);
            expect(store.getState().counter.count).toBe(1);
        });
    });
    describe('redux applyMiddleware', () => {
        it('wraps dispatch method width middleware once', () => {
            function test(spyMethods) {
                return methods => {
                    spyMethods(methods);
                    return next => action => next(action);
                };
            }
            const spy = jest.fn();
            const store = applyMiddleware(test(spy), thunk)(createStore)(todos);
            store.dispatch(addTodo('Use Redux'));
            store.dispatch(addTodo('Flux FTW'));

            expect(spy).toHaveBeenCalledTimes(1);
            expect(store.getState()).to;
        });
    });
});
