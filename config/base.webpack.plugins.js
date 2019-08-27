const path = require('path');
const webpack = require('webpack');
const plugins = [];

// Copies entry html to distribution folder
const HtmlWebpackPlugin = new(require('html-webpack-plugin'))({
  title: 'My App',
  filename: 'index.html',
  template: path.resolve(__dirname, '../src/index.html'),
  favicon: path.resolve(__dirname, '../assets/images/favicon-32x32.png')
});
plugins.push(HtmlWebpackPlugin);

// Source maps
const SourceMapsPlugin = new webpack.SourceMapDevToolPlugin({
  test: /\.js/i,
  exclude: /(node_modules|bower_components)/i,
  filename: `sourcemaps/[name].js.map`
});
plugins.push(SourceMapsPlugin);

// Cleans distribution folder
const CleanWebpackPlugin = new(require('clean-webpack-plugin').CleanWebpackPlugin)();
plugins.push(CleanWebpackPlugin);

// Selects the specific lodash functions
const LodashWebpackPlugin = new(require('lodash-webpack-plugin'))({ currying: true, flattening: true, placeholders: true, paths: true });
plugins.push(LodashWebpackPlugin);

// Optimizes bundle size
// const AggressiveSplittingPlugin = new webpack.optimize.AggressiveSplittingPlugin({
//   minSize: 30000,
//   maxSize: 50000
// });
// plugins.push(AggressiveSplittingPlugin);

// Writes final css to file
const ExtractCssWebpackPlugin = new(require('mini-css-extract-plugin'))({
  chunkFilename: 'css/[name].css',
  filename: 'css/[name].css'
});
plugins.push(ExtractCssWebpackPlugin);

// Makes build-time env vars available to the client-side as constants
const envPlugin = new webpack.DefinePlugin({
  'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH || '/api')
});
plugins.push(envPlugin);

module.exports = { plugins };
