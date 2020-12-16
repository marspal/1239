/**
 * @file 揭开session的神秘面纱
 * @author andyxu
 */


const ContextSession = require('./lib/contextSession');
const CONTEXT_SESSION = Symbol('context#contextSession');
const _CONTEXT_SESSION = Symbol('context#_contextSession');

module.exports = function (opts, app) {
    if (opts && typeof opts.use === 'function') {
        [app, opts] = [opts, app];
    }
    if (!app || typeof app.use !== 'function') {
        throw new TypeError('app instance required: `session(opts, app)`');
    }
    // 处理options,
    // 扩展context属性
    opts = formatOpts(opts);
    extendContext(app.context, opts);
    return async function session(ctx, next) {
        const sess = ctx[CONTEXT_SESSION];
        if (sess.store) {
            await sess.initFromExternal();
        }
        try {
            await next();
        }
        catch (err) {
            throw err;
        }
        finally {
            // 执行提交操作
            if (opts.autoCommit) {
                await sess.commit();
            }
        }
    };
};

function formatOpts(opts) {
    opts = opts || {};
    // back-compat maxage
    if (!('maxAge' in opts)) opts.maxAge = opts.maxage;

}

function extendContext(context, opts) {
    if (context[CONTEXT_SESSION]) {
        return;
    }
    Object.defineProperties(context, {
        [CONTEXT_SESSION]: {
            get() {
                // this指的是context嘛？
                if (this[_CONTEXT_SESSION]) {
                    return this[_CONTEXT_SESSION];
                }
                this[_CONTEXT_SESSION] = new ContextSession(this, opts);
                return this[_CONTEXT_SESSION];
            }
        },
        session: {
        },
        sessionOptions: {
        }
    });
}
