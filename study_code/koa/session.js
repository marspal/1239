/**
 * @file 揭开session的神秘面纱
 * @author andyxu
 * 
 * extendContext(context, opts): 在app.context扩展了三个属性
 * CONTEXT_SESSION, session, sessionOptions
 * 当使用const sess = ctx[CONTEXT_SESSION]; 第一次使用初始化new ContextSession
 */

const util = require('./lib/util');
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
    opts.key = opts.key || 'koa.sess';

    // back-compat maxage
    if (!('maxAge' in opts)) opts.maxAge = opts.maxage;
    // defaults
    if (opts.overwrite == null) opts.overwrite = true;
    if (opts.httpOnly == null) opts.httpOnly = true;
    
    if (opts.sameSite == null) delete opts.sameSite;
    if (opts.signed == null) opts.signed = true;
    if (opts.autoCommit) opts.autoCommit = true;
 
    if (typeof opts.encode !== 'function') {
        opts.encode = util.encode;
    }

    if (typeof opts.decode !== 'function') {
        opts.decode = util.decode;
    }

    if (!opts.genid) {
        opts.genid = +new Date();
    }

    return opts;
}

function extendContext(context, opts) {
    if (context[CONTEXT_SESSION]) {
        return;
    }
    Object.defineProperties(context, {
        [CONTEXT_SESSION]: {
            get() {
                if (this[_CONTEXT_SESSION]) {
                    return this[_CONTEXT_SESSION];
                }
                this[_CONTEXT_SESSION] = new ContextSession(this, opts);
                return this[_CONTEXT_SESSION];
            }
        },
        session: {
            get() {
                return this[CONTEXT_SESSION].get();
            },
            set(val) {
                this[CONTEXT_SESSION].set(val);
            },
            configurable: true
        },
        sessionOptions: {
            get() {
                return this[CONTEXT_SESSION].opts;
            }
        }
    });
}
