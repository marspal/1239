/**
 * @file 揭开session的神秘面纱
 * @author andyxu
 * 
 * extendContext(context, opts): 在app.context扩展了三个属性:
 * - CONTEXT_SESSION: 初始化ContextSession 对生成的contextSession赋初值
 * - session: 通过这个存储器属性去掉用ContextSession get方法初始化session model, 如:session.user 早session上设置user属性, 最后通过commit保存在Cookie中
 * - sessionOptions: 获取opts: 通过formatOpts处理后的
 * 当使用const sess = ctx[CONTEXT_SESSION]; 获取ContextSession实例
 *
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
    // 扩展app.context属性
    opts = formatOpts(opts);
    extendContext(app.context, opts);
    return async function session(ctx, next) {
        const sess = ctx[CONTEXT_SESSION];
        if (this.store) {
            await sess.initFromExternal();
        }
        try {
            // 再其它中间件中执行session操作
            // ctx.session.user
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

function formatOpts(opts = {}) {
    opts.key = opts.key || 'koa.sess';

    // back-compat maxage
    if (!('maxAge' in opts)) opts.maxAge = opts.maxage;
    // defaults: 为什么设置为true: 因为key是唯一的, cookies中根据这个overwrite重写kao.sess值
    if (opts.overwrite == null) opts.overwrite = true;
    if (opts.httpOnly == null) opts.httpOnly = true;
    
    // 设置Cookie的作用域
    if (opts.sameSite == null) delete opts.sameSite;
    if (opts.signed == null) opts.signed = true;
    if (opts.autoCommit) opts.autoCommit = true;
 
    // 同过encode, decode实现加密解密
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
                // this: app.context
                this[_CONTEXT_SESSION] = new ContextSession(this, opts);
                return this[_CONTEXT_SESSION];
            }
        },
        session: {
            get() {
                return this[CONTEXT_SESSION].get();
            },
            set(val) {
                return this[CONTEXT_SESSION].set(val);
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
