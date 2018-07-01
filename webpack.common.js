const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const OUTPUT_FOLDER = 'dist/leancoffee-powerup';


module.exports = {
  entry: {
    main: './src/index.js',
    settings: './src/settings.js'
  },

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
      },
      sideEffects: false
    }]
  },

  plugins: [
    new CleanWebpackPlugin([OUTPUT_FOLDER]),
    new HtmlWebpackPlugin({
      title: 'Lean Coffee Trello Power-up',
      template: '_index.html',
      filename: 'index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      title: 'Lean Coffee Settings',
      template: '_settings.html',
      filename: 'settings.html',
      chunks: ['settings']
    }),
    new CopyWebpackPlugin([
      { from: './assets/**/*', ignore: [{ glob: 'assets/readme/**/*' }] },
      { from: './*.html', ignore: ['_*'] }
    ])
  ]
};
