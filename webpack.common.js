const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(['public']),
    new HtmlWebpackPlugin({
      title: 'TITLE',
      favicon: 'src/logo.svg',
      inject: false,
      template: require('html-webpack-template'),
      appMountId: 'app'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
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
      }
    ]
  }
};
