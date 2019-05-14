const webpack = require('webpack')
const devConfig = require('./webpack.config')

/** @type {webpack.Configuration} */
const config = {
  ...devConfig,
  watch: false,
  mode: 'production',
  devtool: false,
  // TODO: drop console
}

module.exports = config
