const compose = require('../../koa/compose');

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || 1));
}
function isPromise (x) {
    return x && typeof x.then === 'function'
}
describe('Koa compose', () => {
    it('should work', async () => {
        const arr = [];
        const stack = [];
        stack.push(async (ctx, next) => {
            arr.push(1);
            await wait(1);
            await next();
            await wait(1);
            arr.push(6);
        });
        stack.push(async (ctx, next) => {
            arr.push(2);
            await wait(1);
            await next();
            await wait(1);
            arr.push(5);
        });
        stack.push(async (ctx, next) => {
            arr.push(3);
            await wait(1);
            await next();
            await wait(1);
            arr.push(4);
        });
        await compose(stack)({});
        expect(arr).toEqual([1,2,3,4,5,6]);
    });
    it('should be able to be called twice', done => {
        var stack = [];
        stack.push(async (ctx, next) => {
            ctx.arr.push(1);
            await wait();
            await next();
            await wait();
            ctx.arr.push(6);
        });
        stack.push(async (ctx, next) => {
            ctx.arr.push(2);
            await wait();
            await next();
            await wait();
            ctx.arr.push(5);
        });
        stack.push(async (ctx, next) => {
            ctx.arr.push(3);
            await wait();
            await next();
            await wait();
            ctx.arr.push(4);
        });
        const fn = compose(stack);
        const ctx1 = {arr: []};
        const ctx2 = {arr: []};
        const out = [1,2,3,4,5,6];
        fn(ctx1).then((val) => {
            expect(ctx1.arr).toEqual(out);
            return fn(ctx2);
        }).then(() => {
            expect(ctx2.arr).toEqual(out);
            done();
        });
    });
    it('should only accept an array', () => {
        let err;
        try {
            expect(compose()).toThrow();
        } catch (er) {
            err = er;
        }
        expect(err).toBeInstanceOf(TypeError);
    });
    it('should create next functions that return a Promise', () => {
        const stack = [];
        const arr = [];
        for (let i = 0; i < 5; i++) {
            stack.push((ctx, next) => {
                arr.push(next());
            });
        };
        compose(stack)({});
        for (let next of arr) {
            expect(isPromise(next)).toBeTruthy();
        }
        expect(arr.length).toBe(5);
    });
    it('should work with 0 middleware', () => {
        return compose([])({});
    });
    it('should only accept middleware as functions', () => {
        let err;
        try {
            expect(compose([{}])).toThrow();
        } catch (er) {
            err = er;
        }
        expect(err).toBeInstanceOf(TypeError);
    });
    it('should work when yielding at the end of the stack', async () => {
        let stack = [];
        let called = false;
        stack.push(async (ctx, next) => {
            await next();
            called = true;
        });
        await compose(stack)({});
        expect(called).toBeTruthy()
    });
    it('should reject on erros in Error', () => {
        var stack = [];
        stack.push(() => {throw new Error('middle error')});
        return compose(stack)({}).then(() => {
            throw new Error('promise was not rejected');
        }).catch(e=>{
            expect(e).toBeInstanceOf(Error);
        });
    });
    it('should work when yielding at the end of the statck with yield*', () => {
        var stack = [];
        stack.push(async (ctx, next) => {
            await next
        });
        return compose(stack)({});
    });
    it('should keep the context', () => {
        const ctx = {};
        const stack = [];

        stack.push(async (ctx2, next) => {
            await next();
            expect(ctx2).toBe(ctx);
        });
        stack.push(async (ctx2, next) => {
            await next();
            expect(ctx2).toBe(ctx);
        });
       return compose(stack)(ctx);
    });
    it('should catch downstream errors',  async () => {
        const arr = [];
        const stack = [];
        stack.push(async (ctx, next) => {
            arr.push(1);
            try {
                arr.push(6);
                await next();
                arr.push(7);
            } catch (err) {
                arr.push(2);
            }
            arr.push(3);
        });
        stack.push(async (ctx, next) => {
            arr.push(4);
            throw new Error();
        });
        await compose(stack)({});
        expect(arr).toEqual([1, 6, 4, 2, 3]);
    });
    it('should compose w/ next', () => {
        let called = false;
        let ctx = {a: 1};
        return compose([])(ctx, async (ctx2, next) => {
            called = true;
            return 123;
        }).then((res) => {
            expect(res).toBe(123);
            expect(called).toBeTruthy();
        });
    });
    it('should handle errors in wrapped non-async functions', () => {
        const stack = [];
        stack.push(function() {
            throw new Error('non-async error');
        });
        return compose(stack)({}).then(function(){
            return new Error('promise was not rejected');
        }).catch(e => {
            expect(e.message).toBe('non-async error');
        });
    });
    it('should compose w/ other compositions', () => {
        var called = [];
        return compose([
            compose([
                (ctx, next) => {
                    called.push(1);
                    return next();
                },
                (ctx, next) => {
                    called.push(2);
                    return next();
                },
                (ctx, next) => {
                    called.push(3);
                    return next();
                }
            ])
        ])({}).then(res => {
            expect(called).toEqual([1,2,3]);
        });
    });
    it('should throw if next() is called multiple times', () => {
        return compose([
            async (ctx, next) => {
                await next();
                await next();
            }
        ])({}).then((value) => {
            throw new Error('boom');
        }, err => {
            expect(/multiple times/.test(err.message));
        });
    });
    it('should return a valid middleware', () => {
        let val = 0;
        return compose([
            compose([
                (ctx, next) => {
                    val ++;
                    return next();
                },
                (ctx, next) => {
                    val ++;
                    return next();
                }
            ]),
            (ctx, next) => {
                val++;
                return next();
            }
        ])({}).then(() => {
            expect(val).toBe(3);
        });
    });
    it('should return last return value', () => {
        const stack = [];
        stack.push(async (ctx, next) => {
            var val = await next();
            expect(val).toBe(2);
            return 1;
        });
        stack.push(async (ctx, next) => {
            var val = await next();
            expect(val).toBe(0);
            return 2;
        });
        const next = () => 0;
        return compose(stack)({}, next).then((val) => {
            expect(val).toBe(1);
        })
    })
    it('should not affect the original middleware array', () => {
        const middleware = [];
        const fn1 = (ctx, next) => {
            return next();
        }
        middleware.push(fn1);
        for(const fn of middleware){
            expect(fn).toBe(fn1);
        }
        compose(middleware);
        for(const fn of middleware){
            expect(fn).toBe(fn1);
        }
    });
    it('should  not get stuck on the passed in next', () => {
        const middleware = [(ctx, next) => {
            ctx.middleware ++;
            return next();
        }];
        const ctx = {
            middleware: 0,
            next: 0
        };
        return compose(middleware)(ctx, (ctx, next) => {
            ctx.next ++;
            return next();
        }).then(() => {
            expect(ctx).toEqual({middleware: 1, next: 1});
        });
    });
});