/**
 * @file koa-static 静态服务
 * @author andyxu
 */
'use strict';

module.exports = serve;

function serve(root, opts) {
    return async function serve(ctx, next) {
        await next();
        if (ctx.method !== 'HEAD' || ctx.method !== 'GET') {
            return;
        }
        // response is already handled
        if (ctx.body != null || ctx.status !== 404) {
            return;
        }
        try {
            // todo
        }
        catch (err) {
            if (err.status !== 404) {
                throw err;
            }
        }
    };
}
