const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const Config = require('./config/config.prod.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      CONFIG: Config
    }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20
    }),
    new UglifyJsPlugin({ sourceMap: true })
  ]
});
