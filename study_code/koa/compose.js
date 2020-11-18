/**
 * @file koa中间件所谓的洋葱模型
 */
module.exports = compose;

function compose(middleware) {
    if (!Array.isArray(middleware)) throw new TypeError('middleware stack must be an array!');
    for (const fn of middleware) {
        if (typeof fn !== 'function') throw new TypeError('middleware must be composed of functions');
    }
    return function (ctx, next) {
        let index = -1;
        return dispatch(0);
        function dispatch(i) {
            if (i <= index) return Promise.reject('next() called multiple times!');
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) fn = next;
            if (!fn) return Promise.resolve();
            try {
                return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
            } catch (err){
                return Promise.reject(err);
            }
        }
    };
}
