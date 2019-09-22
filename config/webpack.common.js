const path = require('path');

module.exports = {
  paths: {
    entry: {
      App: path.resolve(__dirname, '../src/entry.jsx'),
      Public: path.resolve(__dirname, '../src/containers/public/index.js'),
      Private: path.resolve(__dirname, '../src/containers/private/index.js')
    },
    public: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    src: path.resolve(__dirname, '../src'),
    assets: path.resolve(__dirname, '../assets')
  }
};
