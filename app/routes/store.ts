import 'isomorphic-fetch';

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as ShopifyBuy from 'shopify-buy';
import * as admin from 'firebase-admin';

import ShopifyGraphQLRequest from '../lib/shopify-graphql-helper';
import auth from '../middlewares/auth';
import getCollectionById from '../lib/graphql-queries/getCollectionById';

const Multipassify = require('multipassify');

const serviceAccount = require('../config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});
// Initializing a client
const client = () => {
  return ShopifyBuy.buildClient({
    domain: process.env.SHOPIFY_STORE,
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN
  });
};
const router = new Router();
// after a merchange installs
// router.get('/installed', async (ctx: Koa.ParameterizedContext) => {
//   try {
//     const {SHOPIFY_PARTNER_API_KEY,SHOPIFY_PARTNER_API_SECRET} = process.env
//     const {code,hmac,shop} = ctx.request.query
//     if(code && shop){
//       ctx.session.shopifyAuthCode = code;
//       ctx.session.shopifyShop = shop;
//     }
//     const response = await axios.post(`https://${shop}/admin/oauth/access_token`,{client_id:SHOPIFY_PARTNER_API_KEY,client_secret:SHOPIFY_PARTNER_API_SECRET,code})
//     ctx.session.shopifyAccessToken = response.data.access_token
//     ctx.status = 200
//     ctx.redirect("/store")
//     // ctx.body = {data}
//   } catch (error) {
//     console.log(error, 'ERROR ON REQUEST');
//   }
// });

// store front
router.get('/store', auth, async (ctx: Koa.ParameterizedContext) => {
  try {
    let checkout;
    if (!ctx.session.checkoutId) {
      checkout = await createNewCheckout();
    } else {
      checkout = await client().checkout.fetch(ctx.session.checkoutId);
      // if this is an already complete checkout, create a new cart
      // @ts-ignore
      if (checkout.completedAt != null) {
        checkout = await createNewCheckout();
      }
    }
    ctx.session.checkoutId = checkout.id;
    const vendors = await ctx.firebase
      .firestore()
      .collection('vendors')
      .where('users', 'array-contains', ctx.session.userId)
      .get();
    let vendor: any;
    if (vendors && vendors.docs && vendors.docs.length > 0) {
      vendor = vendors.docs[0].data();
      // const test = await ShopifyGraphQLRequest(getProducts(),null,ctx.session.shopifyAccessToken)
      const bikeQuery = getCollectionById(vendor.shopify_collection_id);
      const bikesCollectionIdGraph = await ShopifyGraphQLRequest(
        bikeQuery,
        null
      );
      if (bikesCollectionIdGraph) {
        const bikesCollectionId =
          bikesCollectionIdGraph.collection.edges[0].node.id;
        const data = await client().collection.fetchWithProducts(
          bikesCollectionId
        );

        ctx.status = 200;
        return ctx.render('store/products.html', {
          data,
          vendor: { ...vendor, id: vendors.docs[0].ref.id },
          checkout
        });
      }
    }
    throw new Error('Vendor not found for user.');
    // ctx.body = {data}
  } catch (error) {
    console.log(error, 'ERROR ON REQUEST');
  }
});
router.patch('/store/cart', auth, async (ctx: Koa.Context) => {
  const { lineItems } = ctx.request.body;
  let checkout: ShopifyBuy.Cart;
  if (!ctx.session.checkoutId) {
    throw new Error('Cart not found');
  } else {
    checkout = await client().checkout.fetch(ctx.session.checkoutId);
  }
  

  const cart = await client().checkout.addLineItems(checkout.id, lineItems);
  ctx.body = cart;
});
router.post('/store/checkout', auth, async (ctx: Koa.Context) => {
  try {
    // prepare cart and add any items
    const { lineItems } = ctx.request.body;
    let checkout: ShopifyBuy.Cart;
    if (!ctx.session.checkoutId) {
      throw new Error('Cart not found');
    } else {
      checkout = await client().checkout.fetch(ctx.session.checkoutId);
    }
    const lis = lineItems.map((item: any) => {
      delete item.title;
      delete item.price;
      return item;
    });

    const cart = await client().checkout.addLineItems(checkout.id, lis);
    console.log(cart, 'cart is ready');

    // multipass login

    const user = await admin.auth().getUser(ctx.session.userId);
    const { SHOPIFY_MULTIPASS_SECRET, HOST, SHOPIFY_STORE } = process.env;
    const multipassify = new Multipassify(SHOPIFY_MULTIPASS_SECRET);
    const customerData = {
      email: user.email,
      return_to: `${HOST}/store/checkout/exit`
    };
    await multipassify.encode(customerData);
    // Generate a Shopify multipass URL to your shop
    const url = multipassify.generateUrl(customerData, SHOPIFY_STORE);
    ctx.status = 200;
    ctx.body = url;
  } catch (error) {
    console.log(error, 'ERROR ON REQUEST');
  }
});

router.get('/store/checkout/exit', auth, async (ctx: Koa.Context) => {
  try {
    let checkout;
    if (!ctx.session.checkoutId) {
      checkout = await client().checkout.create();
    } else {
      checkout = await client().checkout.fetch(ctx.session.checkoutId);
    }
    // redire to cart
    const { webUrl } = checkout as any;
    // ctx.redirect(web_url)
    ctx.status = 200;
    ctx.redirect(webUrl);
  } catch (error) {
    console.log('error on store redirect', error.message);
    return ctx.redirect('/');
  }
});
const createNewCheckout = async () => {
  return await client().checkout.create();
};
export const storeRoutes = router.routes();
