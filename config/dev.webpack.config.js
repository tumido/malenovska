const _ = require('lodash');
const webpackConfig = require('./base.webpack.config');

webpackConfig.mode = 'development';

webpackConfig.stats = {
  entrypoints: false,
  children: false
};

module.exports = _.merge({},
  webpackConfig,
  require('./base.webpack.plugins.js')
);
