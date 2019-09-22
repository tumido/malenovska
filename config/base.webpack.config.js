const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./webpack.common.js');

const webpackConfig = {
  devtool: false,
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    historyApiFallback: true,
    overlay: true
  },
  entry: config.paths.entry,
  output: {
    filename: 'js/[name].js',
    path: config.paths.public,
    publicPath: config.paths.publicPath,
    chunkFilename: 'js/[name].js'
  },
  resolve: {
    modules: [ 'src', 'node_modules' ],
    extensions: [ '.js', '.jsx', '.scss', '.jpg' ],
    alias: {
      assets: config.paths.assets,
    }
  },
  module: {
    rules: [{
      test: /src\/.*\.jsx?$/,
      exclude: /node_modules/,
      use: [ 'source-map-loader', 'babel-loader' ]
    }, {
      test: /\.s?[ac]ss$/,
      use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
    }, {
      test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader'
    }]
  }
};

module.exports = webpackConfig;
