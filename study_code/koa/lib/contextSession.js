/**
 * @file session上下文
 */

class ContextSession {
    constructor(ctx, opts) {
        this.ctx = ctx;
        this.app = ctx.app;
        this.opts = Object.assign({}, opts);
    }

    get() {
        const session = this.session;
        if(session) return session;
        this.initFromCookie();
        return this.session;
    }

    async commit() {
        const session = this.session;
        const opts = this.opts;
        const ctx = this.ctx;
    }
}

module.exports = ContextSession;
