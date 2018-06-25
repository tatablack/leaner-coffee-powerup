const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const Config = require("./config.js");

const isProduction = process.env.NODE_ENV === 'production';
const OUTPUT_FOLDER = 'dist/leancoffee-powerup';

const modulesPlugin = (isProduction ?
  new webpack.HashedModuleIdsPlugin({
    hashFunction: 'sha256',
    hashDigest: 'hex',
    hashDigestLength: 20
  }) :
  new webpack.NamedModulesPlugin());

module.exports = {
  mode: 'production',
  devtool: isProduction ? 'source-map' : 'source-map',
  
  entry: './src/index.js',

  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, OUTPUT_FOLDER)
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },

  plugins: [
    new CleanWebpackPlugin([OUTPUT_FOLDER]),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      CONFIG: Config
    }),
    modulesPlugin,
    new HtmlWebpackPlugin({
      title: 'Lean Coffee Trello Power-up',
      template: '_index.html',
      filename: 'index.html'
    }),
    new UglifyJsPlugin({ sourceMap: true }),
    new CopyWebpackPlugin([
      { from: './assets/**/*', ignore: [{ glob: 'assets/readme/**/*' }] },
      { from: './*.html', ignore: ['_*'] }
    ])
  ],
};
