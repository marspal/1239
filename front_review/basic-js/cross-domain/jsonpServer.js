const Koa = require("koa");
const app = new Koa();

app.use((ctx, next)=>{
  if (ctx.path === "/api/jsonp") {
    const { cb, msg } = ctx.query;
    console.log(cb, msg);  
    ctx.body = `${cb}(${JSON.stringify({ msg })})`;    
    return;  
  }
});
app.listen(8080);