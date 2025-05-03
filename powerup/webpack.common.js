const path = require("node:path");

const dotenvx = require("@dotenvx/dotenvx");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const yaml = require("js-yaml");
const webpack = require("webpack");

const OUTPUT_FOLDER = "../docs";

// Load configuration
dotenvx.config({
  strict: true,
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env",
});

const Config = {
  [process.env.NODE_ENV]: {
    hostname: process.env.HOSTNAME,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
    defaultDuration: parseInt(process.env.DEFAULT_DURATION, 10),
    supportedLocales: JSON.parse(process.env.SUPPORTED_LOCALES),
  },
};

const SentryDefaultOptions = {
  sendDefaultPii: false,
  release: process.env.VERSION,
  environment: process.env.NODE_ENV,
};

module.exports = {
  mode: process.env.NODE_ENV,

  entry: {
    main: "./src/index.ts",
    settings: "./src/settings.ts",
    discussion_ui: "./src/discussion-ui.ts",
    ongoing_or_paused: "./src/popups/ongoing_or_paused.ts",
  },

  output: {
    filename: "[name].[fullhash].js",
    path: path.resolve(__dirname, OUTPUT_FOLDER),
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.([tj])s$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      CONFIG: Config,
      VERSION: process.env.VERSION,
      SENTRY_DSN: process.env.SENTRY_DSN,
    }),

    new HtmlWebpackPlugin({
      title: "Lean Coffee Trello Power-up",
      template: "_index.html",
      filename: "index.html",
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      title: "Lean Coffee Settings",
      template: "_settings.html",
      filename: "settings.html",
      chunks: ["settings"],
    }),
    new HtmlWebpackPlugin({
      title: "Discussion UI",
      template: "_discussion-ui.html",
      filename: "discussion-ui.html",
      chunks: ["discussion_ui"],
    }),
    new HtmlWebpackPlugin({
      title: "Ongoing or paused",
      template: "_ongoing_or_paused.html",
      filename: "ongoing_or_paused.html",
      chunks: ["ongoing_or_paused"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "..", "assets"),
          to: "assets",
          globOptions: {
            ignore:
              process.env.NODE_ENV === "production"
                ? []
                : ["assets/listings/**/*"],
          },
        },
        {
          from: "i18n/*.yml",
          to: "i18n/[name].json",
          transform: (content) =>
            Buffer.from(
              JSON.stringify(
                yaml.load(content.toString("utf8"), {
                  schema: yaml.JSON_SCHEMA,
                }),
              ),
              "utf8",
            ),
        },
        {
          from: "*.html",
          transform: (content) =>
            Buffer.from(
              content
                .toString("utf8")
                .replace("SENTRY_CDN", process.env.SENTRY_CDN)
                .replace(
                  "SentryDefaultOptions",
                  JSON.stringify(SentryDefaultOptions),
                ),
              "utf8",
            ),
          globOptions: { ignore: ["_*"] },
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
};
