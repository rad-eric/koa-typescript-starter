export default (sku: string) => {
  const query = `{
        productVariants(first: 1, query: "sku:${sku}") {
            edges {
                node {
                id
                image{
                  originalSrc
                }
                sku
                legacyResourceId
                displayName
                inventoryItem {
                  id
                  legacyResourceId
                }
              }
            }
        }
      }`;
  return query;
};
