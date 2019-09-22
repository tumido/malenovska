const _ = require('lodash');
const webpackConfig = require('./base.webpack.config');

webpackConfig.mode = 'production';

webpackConfig.optimization = {
  minimize: true,
  usedExports: true,
  namedModules: true,
  namedChunks: true,
  runtimeChunk: 'single',
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: Infinity,
    minSize: 0,
    // cacheGroups: {
    //   vendor: {
    //     test: /[\\/]node_modules[\\/]/,
    //     name(module) {
    //       const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
    //       return `npm.${packageName}`;
    //     }
    //   }
    // }
  }
};

webpackConfig.output.filename = 'js/[name].[contenthash].js';
webpackConfig.output.chunkFilename = 'js/[name].[contenthash].js';

module.exports = _.merge({},
  webpackConfig,
  require('./prod.webpack.plugins.js')
);
