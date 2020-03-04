import * as Koa from 'koa';
import * as Router from 'koa-router';

const router = new Router();

/**
 * Base route
 */
router.get('/', async (ctx: Koa.ParameterizedContext) => {
  if (ctx.session.userId) {
    return ctx.redirect('/store');
  }
  ctx.status = 200;
  return ctx.render('./signin.html');
});

router.get('/signin', async (ctx: Koa.ParameterizedContext) => {
  return ctx.render('./signin.html');
});

router.post('/signin', async (ctx: Koa.ParameterizedContext) => {
  try {
    const { email, password } = ctx.request.body;
    const response = await ctx.firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const { user } = response;
    ctx.session.userId = user.uid;
    return ctx.redirect('/store');
    // multipass login
    //   const {SHOPIFY_MULTIPASS_SECRET,HOST,SHOPIFY_STORE} = process.env
    //   const multipassify = new Multipassify(SHOPIFY_MULTIPASS_SECRET);
    //   const customerData = { email: user.email, return_to:`${HOST}/store`};
    //   const tokenMultipass = await multipassify.encode(customerData);
    // // Generate a Shopify multipass URL to your shop
    //   const url = multipassify.generateUrl(customerData, SHOPIFY_STORE);

    //   return ctx.redirect(url)
  } catch (error) {
    console.log(error, 'error on signin!');
    ctx.redirect('/404');
  }
});
router.get('/signout', async (ctx: Koa.ParameterizedContext) => {
  ctx.session = null;
  ctx.redirect('/');
});
export const authRoutes = router.routes();
