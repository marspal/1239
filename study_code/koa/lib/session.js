/**
 * @file Session model
 * 
 * 心得: new Session(ctx, obj), 创建session对象, 用于存储我们新加在session中的数据
 * ctx: 为App.context数据,可以取得所有koa的信息
 * obj: 为session初始数据; ctx.session = {a: 1}; obj为{a: 1}
 * 
 * obj中的数据传给session, toJSON的时候去掉些_的数据
 */
'use strict';

class Session {
  constructor(sessionContext, obj){
    // _sessCtx= new SessionContext
    // _cyx = app.context
    this._sessCtx = sessionContext;
    this._ctx = sessionContext.ctx;
    if (!obj) { // 没有初始化的session(形如ctx.session = {}); isNew: true
      this.isNew = true;
    } else {
      for (const k in obj) {
        // restore maxAge from store
        if (k === '_maxAge') this._ctx.sessionOptions.maxAge = obj._maxAge;
        // 如果_session为true,则cookie则为会话级别
        else if (k === '_session') this._ctx.sessionOptions.maxAge = 'session';
        else this[k] = obj[k];
      }
    }
  }
  toJSON() {
    const obj = {};
    Object.keys(this).forEach(key =>{
      if(key === 'isNew') return;
      if(key[0] === '_') return;
      obj[key] = this[key];
    });
    return obj;
  }
  inspect(){
    return this.toJSON();
  }

  get length(){
    return Object.keys(this.toJSON()).length;
  }

  get populated(){
    return !!this.length;
  }

  get maxAge() {
    return this._ctx.sessionOptions.maxAge;
  }

  set maxAge(val) {
    this._ctx.sessionOptions.maxAge = val;
     // maxAge changed, must save to cookie and store
    this._requireSave = true;
  }

  save() {
    this._requireSave = true;
  }
  async manuallyCommit() {
    await this._sessCtx.commit();
  } 
}
module.exports = Session;