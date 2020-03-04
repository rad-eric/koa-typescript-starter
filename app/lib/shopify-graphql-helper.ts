import { GraphQLClient } from 'graphql-request';
export const ShopifyGraphQLEndpoint = () =>
  `https://${process.env.SHOPIFY_STORE}/api/2019-07/graphql`;

export const ShopifyGraphQLHeaders = (accessToken?: string) => {
  const headers: any = {
    headers: {
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN
    }
  };
  if (accessToken) {
    headers.headers['X-Shopify-Access-Token'] = accessToken;
  }
  return headers;
};
const ShopifyGraphQLRequest = async (
  query: string,
  variables: any,
  accessToken?: string
) => {
  try {
    const client = new GraphQLClient(
      ShopifyGraphQLEndpoint(),
      ShopifyGraphQLHeaders(accessToken)
    );

    return await client.request(query, variables);
  } catch (error) {
    console.log('GRAPHQIL ERROR!!!--->', error.message);
    return error;
  }
};
export default ShopifyGraphQLRequest;
