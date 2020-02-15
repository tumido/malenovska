const path = require('path');

module.exports = {
  paths: {
    entry: {
      main: [
        'core-js/modules/es.promise',
        'core-js/modules/es.array.iterator',
        path.resolve(__dirname, '../src/entry.jsx')
      ]
      // admin: path.resolve(__dirname, '../src/containers/private')
    },
    public: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    src: path.resolve(__dirname, '../src'),
    assets: path.resolve(__dirname, '../assets')
  }
};
