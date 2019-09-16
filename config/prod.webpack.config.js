const _ = require('lodash');
const webpackConfig = require('./base.webpack.config');

webpackConfig.mode = 'production';

webpackConfig.optimization = {
  minimize: true,
  usedExports: true,
  runtimeChunk: 'single',
  splitChunks: {
    chunks: 'all'
  }
},

webpackConfig.output.filename = 'js/[name].[hash].js';
webpackConfig.output.chunkFilename = 'js/[name].[hash].js';

module.exports = _.merge({},
  webpackConfig,
  require('./prod.webpack.plugins.js')
);
