const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/entry.jsx',
  output: {
    filename: '[name].[chunkhash].main.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: [ '*', '.js', '.jsx' ],
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      containers: path.resolve(__dirname, 'src/containers')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                { modules: false }
              ],
              '@babel/preset-react'
            ]
            // plugins: [ 'lodash' ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [ 'file-loader', 'webp-loader' ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.EnvironmentPlugin([ 'NODE_ENV' ])
  ]
};
