const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const { merge } = require('webpack-merge');

const PACKAGE_JSON = require('./package.json');
const common = require('./webpack.common.js');

const Config = require('./config/config.dev.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      CONFIG: Config,
      VERSION: PACKAGE_JSON.version
    })
  ],

  devServer: {
    watchOptions: {
      ignored: ['error.png', '.github', '.idea', 'assets/listings', 'dist', 'docs', 'node_modules', 'tools'].map(
        (item) => path.resolve(__dirname, item)
      )
    },
    open: true,
    publicPath: '/',
    clientLogLevel: 'info',
    liveReload: false,
    stats: 'errors-warnings',
    https: {
      key: fs.readFileSync('localhost.key'),
      cert: fs.readFileSync('localhost.cert')
    }
  }
});
