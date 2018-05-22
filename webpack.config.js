const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  watch: true,
  entry: {
    background: './src/background',
    popup: './src/popup',
    editor: './src/editor',
  },
  output: {
    path: path.resolve('chrome/dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['chrome/dist']),
    new HtmlWebpackPlugin({
      title: 'System Monitor',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      title: 'System Monitor',
      filename: 'editor.html',
      chunks: ['editor'],
    }),
  ],
}
