/**
 * @file Redux 测试
 * @author xumingquan
 */
const {createStore, combineReducer} = require('../../react-family/redux');
const initState = {
    count: 1
};
const stateInfo = {
    message: 'andyxu'
};
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

    });
});
