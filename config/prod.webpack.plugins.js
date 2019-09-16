const { plugins } = require('./base.webpack.plugins');

const BundleAnalyzerPlugin = new(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
  openAnalyzer: false
});
plugins.push(BundleAnalyzerPlugin);

module.exports = { plugins };
