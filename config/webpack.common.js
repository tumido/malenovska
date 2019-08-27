const path = require('path');

module.exports = {
  paths: {
    entry: path.resolve(__dirname, '../src/entry.js'),
    public: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    src: path.resolve(__dirname, '../src'),
    assets: path.resolve(__dirname, '../assets')
  }
};
