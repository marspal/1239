/**
 * @file session上下文
 */

class ContextSession {
    constructor(ctx, opts) {
        this.ctx = ctx;
        this.app = ctx.app;
        this.opts = Object.assign({}, opts);
    }

    async commit() {
        const session = this.session;
        const opts = this.opts;
        const ctx = this.ctx;
    }
}

module.exports = ContextSession;
