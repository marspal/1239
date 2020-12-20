/**
 * @file session上下文
 */

const Session = require("./session");
const util = require("./util");

const COOKIE_EXP_DATE = new Date(util.CookieDateEpoch);
const ONE_DAY = 24 * 60 * 60 * 1000;

class ContextSession {
    constructor(ctx, opts) {
        // ctx: app.context
        this.ctx = ctx;
        this.app = ctx.app;
        this.opts = Object.assign({}, opts);
        this.store = this.opts.contextStore ? this.opts.contextStore(ctx) : this.opts.store;
    }

    get() {
        const session = this.session;
        if(session) return session;
        this.initFromCookie();
        return this.session;
    }

    set(val) {}

    initFromCookie() {
        const ctx = this.ctx;
        const opts = this.opts;
        const cookie = ctx.cookies.get(opts.key, opts);
        if (!cookie) {
            this.create();
            return;
        }
    }

    create(val) {
        this.session = new Session(this, val);
    }

    async commit() {
        const session = this.session;
        const ctx = this.ctx;
        const opts = this.opts;
        const reason = this._shouldSaveSession();
        if(!reason) return;
        if (typeof opts.beforeSave === 'function'){
            opts.beforeSave(ctx, session);
        }
        const changed = reason === 'changed';
        await this.save(changed);
    }
    _shouldSaveSession() {
        const prevHash = this.prevHash;
        const session = this.session;
        // force save session when `session._requireSave` set
        // 这个值在session中save函数调用, maxAge被调用的时候设置
        if(session._requireSave) return 'force';
        // // do nothing if new and not populated
        const json = session.toJSON();
        if (!prevHash && !Object.keys(json).length) return '';

        const changed = prevHash !== util.hash(json);
        if(changed) return 'changed'
        return '';
    }

    async save(changed){
        const opts = this.opts;
        const key = opts.key;
        // 取得被保存session
        let json = this.session.toJSON();
        // set expire for check
        let maxAge = opts.maxAge ? opts.maxAge : ONE_DAY;
        // maxAge: session, 说明在客户端设置的是会话级别的cookie
        // 关闭浏览器 这清除cookie
        if (maxAge === 'session') {
            opts.maxAge = undefined;
            json._session = true;
        }
        json._expire = maxAge + Date.now();
        json._maxAge = maxAge;

        json = opts.encode(json);
        this.ctx.cookies.set(key, json, opts);
    }
}

module.exports = ContextSession;
