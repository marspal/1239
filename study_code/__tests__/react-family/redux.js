/**
 * @file Redux 测试
 */
const createStore = require('../../react-family/redux');

describe('redux', () => {
    it('should return the initState', () => {
        const state = {
            a: 1,
            b: {c: 1, d: 1}
        };
        const store = createStore(state);
        expect(store.getState()).toEqual(state);
    });
    it('should return the correct state after called the changeState', () => {
        const state = {
            a: 1,
            b: {c: 1, d: 1}
        };
        const store = createStore();
        store.changeState(state);
        expect(store.getState()).toBe(state);
    });
    it('listener should be called when change state', () => {
        const state = {
            a: 1
        };
        const store = createStore();
        const listener = jest.fn(() => {
            const state = store.getState();
            expect(state).toEqual(state);
        });
        store.subscribe(listener);
        store.changeState(state);
        expect(listener).toHaveBeenCalled();
    });
});
