const _ = require('lodash');
const webpackConfig = require('./base.webpack.config');

webpackConfig.devServer = {
  port: 3000,
  hot: true,
  host: '0.0.0.0',
  historyApiFallback: true,
  overlay: true
};

webpackConfig.stats = {
  entrypoints: false,
  children: false
};

module.exports = _.merge({},
  webpackConfig,
  require('./dev.webpack.plugins.js')
);
