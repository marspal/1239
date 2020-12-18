/**
 * @file session上下文
 */

const Session = require("./session");

class ContextSession {
    // ctx = app.context
    constructor(ctx, opts) {
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
        const ctx = this.opts;
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
        if (typeof opts.beforeSave === 'function'){
            opts.beforeSave(ctx, session);
        }
        const changed = reason === 'changed';
        await this.save(changed);
    }
    _shouldSaveSession() {
        return '';
    }

    async save(changed){
        const opts = this.opts;
        const key = opts.key;
        let json = this.session.toJSON();
        // set expire for check
        let maxAge = opts.maxAge ? opts.maxAge : ONE_DAY;
        json._expire = maxAge + Date.now();
        json._maxAge = maxAge;

        json = opts.encode(json);
        this.ctx.cookies.set(opts.key, json, opts);
    }
}

module.exports = ContextSession;
