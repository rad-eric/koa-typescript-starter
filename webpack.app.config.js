
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: "./js-src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),    
  },
  mode: 'development',
  plugins: [
    new CopyPlugin([
      { from: 'views/**/*.html', to: '' },
      { from: 'public/**/*', to: '' },
    ]),
  ],
};
