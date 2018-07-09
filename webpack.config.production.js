const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const config = require('./webpack.config')

module.exports = {
  ...config,
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
