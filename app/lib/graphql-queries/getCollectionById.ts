export default (collectionId: string) => {
  const query = `
    {
        collection:collections(first:1,query:"id:${collectionId}"){
            edges{
            node{
                id
                title
                description
                handle
            }

            }
        }
    }
        `;
  return query;
};
