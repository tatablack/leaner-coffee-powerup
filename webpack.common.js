const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const yaml = require('js-yaml');

const OUTPUT_FOLDER = 'docs';

module.exports = {
  entry: {
    main: './src/index.ts',
    settings: './src/settings.ts',
    discussion_ui: './src/discussion-ui.ts',
    ongoing_or_paused: './src/popups/ongoing_or_paused.ts'
  },

  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, OUTPUT_FOLDER)
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.([tj])s$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
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
    new HtmlWebpackPlugin({
      title: 'Discussion UI',
      template: '_discussion-ui.html',
      filename: 'discussion-ui.html',
      chunks: ['discussion_ui']
    }),
    new HtmlWebpackPlugin({
      title: 'Ongoing or paused',
      template: '_ongoing_or_paused.html',
      filename: 'ongoing_or_paused.html',
      chunks: ['ongoing_or_paused']
    }),
    new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: 'assets/**/*',
            globOptions: {
              ignore: process.env.NODE_ENV === 'production' ? [] : ['assets/listings/**/*']
            }
          },
          {
            from: 'i18n/*.yml',
            to: 'i18n/[name].json',
            transform: (content) => Buffer.from(
              JSON.stringify(
                yaml.safeLoad(content.toString('utf8'), { schema: yaml.JSON_SCHEMA })
              ),
              'utf8'
            )
          },
          { from: '*.html', globOptions: { ignore: ['_*'] } }
        ]
      }
    )
  ]
};
