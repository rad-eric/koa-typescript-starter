const views = require('koa-views');
const path = require('path');
const pathRoute = path.join(__dirname, '../views');

// setup mapping the .html views to the swig template engine
export default views(pathRoute, {
  map: { html: 'swig' }
});
