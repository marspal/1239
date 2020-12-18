/**
 * @file Session model
 */

class Session {
  constructor(sessionContext, obj){
    this._sessCtx = sessionContext;
    this._ctx = sessionContext.ctx;
    if (!obj) {
      this.isNew = true;
    } else {
      for (const k in obj) {
        // restore maxAge from store
        if (k === '_maxAge') this._ctx.sessionOptions.maxAge = obj._maxAge;
        else if (k === '_session') this._ctx.sessionOptions.maxAge = 'session';
        else this[k] = obj[k];
      }
    }
  }
}
module.exports = Session;