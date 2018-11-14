const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const devConfig = require('./webpack.config')

/** @type {webpack.Configuration} */
const config = {
  ...devConfig,
  watch: false,
  mode: 'production',
  devtool: false,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
}

module.exports = config
