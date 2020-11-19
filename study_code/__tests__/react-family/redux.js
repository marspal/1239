/**
 * @file Redux 测试
 */
const createStore = require('../../react-family/redux');
const initState = {
    count: 1
};
function changeCount(state, action) {
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
describe('redux', () => {
    it('should return the initState', () => {
        const store = createStore(changeCount, initState);
        expect(store.getState().count).toEqual(1);
    });
    it('should return the correct state after called the dispatch with param {type: "INCREMENT"}', () => {
        const store = createStore(changeCount, initState);
        store.dispatch({type: 'INCREMENT'});
        expect(store.getState().count).toBe(2);
    });
    it('should count decrement minus 1 with {type: "DECREMENT"}', () => {
        const store = createStore(changeCount, initState);
        store.dispatch({type: 'DECREMENT'});
        expect(store.getState().count).toBe(0);
    });
    it('listener should be called when change state', () => {
        const store = createStore(changeCount, initState);
        const listener = jest.fn(() => {
            const state = store.getState();
            expect(state).toEqual(state);
        });
        store.subscribe(listener);
        store.dispatch({type: 'DECREMENT'});
        expect(listener).toHaveBeenCalled();
    });
});
