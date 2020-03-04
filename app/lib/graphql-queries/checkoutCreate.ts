export default () => {
  const mutation = `mutation {
        checkoutCreate(input: {
          lineItems: [{ variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8xMzg3MDQ4MzI3NTc5OA==", quantity: 1 }]
        }) {
          checkout {
             id
             webUrl
             lineItems(first: 5) {
               edges {
                 node {
                   title
                   quantity
                 }
               }
             }
          }
       `;
  return mutation;
};
