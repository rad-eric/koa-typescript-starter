import * as Koa from 'koa';
import * as Router from 'koa-router';
const router = new Router();

/**
 * Base route
 */
// router.get('/', async ctx => {
//   ctx.status = 200;
//   ctx.body = 'hi';
// });

router.get('/404', async (ctx: Koa.ParameterizedContext) => {
  await ctx.render('404.html');
});

export const unprotectedRoutes = router.routes();
