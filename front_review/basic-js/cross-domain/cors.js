const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();
const cors = require('koa-cors');

// app.use(cors());
router.post('/cors', async (ctx, next) => {
  console.log(ctx.headers.origin, '===');
  ctx.set("Access-Control-Allow-Origin", "http://10.60.110.145:8080");
  ctx.set("Access-Control-Allow-Credentials", true);
  ctx.set("Access-Control-Request-Method", "PUT,POST,GET,DELETE,OPTIONS");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, cc, uid"
  );
  console.log(ctx.cookies.get('uid'), '====')
  ctx.body = `{status: "success"}`;
  
});

router.options("/cors", async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "http://10.60.110.145:8080");
  ctx.set("Access-Control-Allow-Credentials", true);
  ctx.set("Access-Control-Request-Method", "PUT,POST,GET,DELETE,OPTIONS");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, cc, uid"
  );
  ctx.status = 204;
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log(`server runs 3000`);
})