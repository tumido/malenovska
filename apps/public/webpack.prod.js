const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  cache: {
    type: 'filesystem'
  },
  performance: {
    hints: 'warning'
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true,
      defaultSizes: 'stat'
    })
  ],
  optimization: {
    usedExports: true,
    minimize: true,
    chunkIds: 'named',
    moduleIds: 'named',
    minimizer: [ new TerserPlugin({ sourceMap: true, extractComments: true }) ]
  }
});
