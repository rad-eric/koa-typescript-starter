const path = require('path')
module.exports = {
    entry: "./js-src/index.js",
    output: {
        path: path.resolve(__dirname, "public/js"),
        filename: "main.js"
     },
     mode:"development"
 };