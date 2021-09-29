const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'web',
  devServer: {
    contentBase: './dist',
    proxy: {
      '/api': 'http://localhost:4500',
      '/login': 'http://localhost:4500',
      '/logout': 'http://localhost:4500',
    },
  },
});
