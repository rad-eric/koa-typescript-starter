export default () => {
  const query = `
  {
    products(first:1){
      edges{
        node{
          id
        }
      }
    }
  }`;
  return query;
};
