const { plugins } = require('./base.webpack.plugins');
const webpack = require('webpack');

// const BundleAnalyzerPlugin = new(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
//   openAnalyzer: false
// });
// plugins.push(BundleAnalyzerPlugin);

const HashedModuleIdsPlugin = new webpack.HashedModuleIdsPlugin();
plugins.push(HashedModuleIdsPlugin);

module.exports = { plugins };
