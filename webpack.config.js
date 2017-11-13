const webpack = require('webpack');
const path = require('path');

module.exports = {
   context : path.resolve(__dirname, 'app/js'),
   entry : './index.js',
   output : {
      path : path.resolve(__dirname, 'dist'),
      filename : 'bundle.js'
   },
   module : {
      rules : [{
         test : /\.js$/,
         include : path.resolve(__dirname, 'app/js'),
         use : [{
            loader : 'babel-loader',
            options : {
               presets : ['es2015', { modules: false }]
            }
         }]
      }]
   }
}