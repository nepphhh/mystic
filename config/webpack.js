/*jshint esversion: 6*/
/*global require, module, exports, console*/
/*jshint -W097*/

"use strict";

module.exports = {
    entry: "./src/client/js/client.js",
    output: {
      filename: "app.js"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.es6$|\.js$/,
                loader: "babel-loader",
                options: {
                    babelrc: false,
                    presets: ['@babel/preset-env'] 
            }, 
            }, 
        ], 
    }, 
};