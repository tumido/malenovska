const _ = require('lodash');
const webpackConfig = require('./base.webpack.config');

webpackConfig.mode = 'production';

webpackConfig.optimization = {
  minimize: true,
  usedExports: true,
  runtimeChunk: 'single',
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: Infinity,
    minSize: 0
  }
};

webpackConfig.output.filename = 'js/[name].[contenthash].js';
webpackConfig.output.chunkFilename = 'js/[name].[contenthash].js';

module.exports = _.merge({},
  webpackConfig,
  require('./prod.webpack.plugins.js')
);
