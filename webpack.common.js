const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  entry: {
    app: ['babel-polyfill', './client/App.js']
  },
  plugins: [
    new CleanWebpackPlugin(['public']),
    new HtmlWebpackPlugin({
      title: 'self-referential blog',
      favicon: 'assets/logo.svg',
      inject: false,
      template: require('html-webpack-template'),
      appMountId: 'app',
      baseHref: '/public/'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'assets'),
      Client: path.resolve(__dirname, 'client')
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }, {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }, {
        test: /\.svg$/,
        use: {
          loader: 'react-svg-loader'
        }
      }, {
        test: /\.(jpg|png)$/,
        loader: 'url-loader'
      }, {
        test: /\.(md|txt)$/,
        loader: 'raw-loader'
      }
    ]
  }
};
