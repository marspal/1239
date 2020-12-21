/**
 * @file session上下文
 */

const Session = require("./session");
const util = require("./util");

const COOKIE_EXP_DATE = new Date(util.CookieDateEpoch);
const ONE_DAY = 24 * 60 * 60 * 1000;

class ContextSession {
    constructor(ctx, opts) {
        /**
         * ctx: app.context
         * app: new Koa()
         */
        this.ctx = ctx;
        this.app = ctx.app;
        this.opts = Object.assign({}, opts);
        this.store = this.opts.contextStore ? new this.opts.ContextStore(ctx) : this.opts.store;
    }

    get() {
        const session = this.session;
        if (session) {
            return session;
        }
        if (session === false) {
            return null;
        }
        this.store ? this.create() : this.initFromCookie();
        return this.session;
    }
    // 可以直接给session复制一个对象; ctx.session={}; 则根据当前值生成一个session model;
    set(val) {
        if (val === null) {
            this.session = false;
            return;
        }
        if (typeof val === 'object') {
            this.create(val, this.externalKey);
            return;
        }
        throw new Error('this.session can only be set as null or an object');
    }

    async initFromExternal() {
        const ctx = this.ctx;
        const opts = this.opts;
        
        let externalKey = ctx.cookies.get(opts.key, opts);
        if (!externalKey) {
            // create a new `externalKey`
            this.create();
            return;
        }
        const json = await this.store.get(externalKey, opts.maxAge, { ctx, rolling: opts.rolling });
        if (!this.valid(json, externalKey)) {
            // create a new `externalKey`
            this.create();
            return;
        }
        this.create(json, externalKey);
        this.prevHash = util.hash(this.session.toJSON());
    }

    initFromCookie() {
        const ctx = this.ctx;
        const opts = this.opts;
        const cookie = ctx.cookies.get(opts.key, opts);
        // 如果非会话cookie; session 存在客户端
        if (!cookie) {
            this.create();
            return;
        }
        let json;
        try {
            json = opts.decode(cookie);
        }
        catch (err) {

        }
        if (!this.invalid(json)) {
            this.create();
            return;
        }
        // support access `ctx.session` before session middleware
        this.create(json);
        this.prevHash = util.hash(this.session.toJSON());
        return;
    }

    create(val, externalKey) {
        if (this.store) this.externalKey = externalKey || this.opts.genid && this.opts.genid(this.ctx);
        this.session = new Session(this, val);
    }

    invalid(value, key) {
        const ctx = this.ctx;
        if (!value) {
            this.emit('missed', {key, value, ctx});
            return false;
        }
        if (value._expire && value._expire < Date.now()) {
            this.emit('expired', {key, value, ctx});
            return false;
        }
        const valid = this.opts.valid;
        if (typeof valid === 'function' && !valid(ctx, value)) {
            // valid session value fail, ignore this session
            this.emit('invalid', {key, value, ctx});
            return false;
        }
        return true;
    }

    emit(event, data) {
        setImmediate(() => {
            this.app.emit(`session:${event}`, data);
        });
    }

    async commit() {
        const session = this.session;
        const ctx = this.ctx;
        const opts = this.opts;
        const reason = this._shouldSaveSession();
        if (!reason) return;
        if (typeof opts.beforeSave === 'function') {
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
        // do nothing if new and not populated
        const json = session.toJSON();
        if (!prevHash && !Object.keys(json).length) return '';

        const changed = prevHash !== util.hash(json);
        if (changed) return 'changed';

        // save if opts.rolling set
        if (this.opts.rolling) return 'rolling';
          // save if opts.renew and session will expired
        if (this.opts.renew) {
            const expire = session._expire;
            const maxAge = session.maxAge;
            // renew when session will expired in maxAge / 2
            if (expire && maxAge && expire - Date.now() < maxAge / 2) return 'renew';
        }
        return '';
    }

    async save(changed) {
        const opts = this.opts;
        const key = opts.key;
        const externalKey = this.externalKey;
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
        else {
            json._expire = maxAge + Date.now();
            json._maxAge = maxAge;
        }

        // save to external store
        if (externalKey) {
            if (typeof maxAge === 'number') {
                // ensure store expired after cookie
                maxAge += 10000;
            }
            await this.store.set(externalKey, json, maxAge, {
                changed,
                ctx: this.ctx,
                rolling: opts.rolling
            });
            this.ctx.cookies.set(key, externalKey, opts);
            return;
        }

        json = opts.encode(json);
        this.ctx.cookies.set(key, json, opts);
    }
}

module.exports = ContextSession;
