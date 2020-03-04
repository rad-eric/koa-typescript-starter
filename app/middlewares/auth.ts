import * as Koa from 'koa';
export default async (ctx: Koa.Context, next: Function) => {
  console.log('lookig for user-----', ctx.session.userId);

  if (!ctx.session.userId) {
    return await ctx.redirect('/signin');
  }
  await next();
};
