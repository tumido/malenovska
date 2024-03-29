const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: './dist',
    client: {
      progress: true,
      overlay: true,
    },
    hot: true,
    historyApiFallback: true,
  },
  plugins: [
    new ReactRefreshPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      DEVELOPMENT: "true",
    })
  ],
});
