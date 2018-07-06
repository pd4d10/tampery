const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  mode: 'development',
  watch: true,
  devtool: 'source-map',
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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new CleanWebpackPlugin(['chrome/dist']),
    new MonacoWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Tamper Popup',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      title: 'Tamper Editor',
      filename: 'editor.html',
      chunks: ['editor'],
    }),
  ],
}
