const path = require("node:path");

const dotenvx = require("@dotenvx/dotenvx");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");
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

const TEMPLATE_PARAMETERS = {
  SENTRY_LOADER: process.env.SENTRY_LOADER,
  UMAMI_LOADER: process.env.UMAMI_LOADER,
  ANALYTICS_TAG: `${process.env.NODE_ENV}_${process.env.VERSION}`.substring(
    0,
    50,
  ),
};

module.exports = {
  mode: process.env.NODE_ENV,

  output: {
    path: path.resolve(__dirname, OUTPUT_FOLDER),
    crossOriginLoading: "anonymous",
  },

  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@scripts": path.join(__dirname, "src"),
    },
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        type: "asset", // <= important to inline SVG into HTML
        loader: "svgo-loader",
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      CONFIG: Config,
      VERSION: process.env.VERSION,
    }),

    new HtmlBundlerPlugin({
      entry: [
        {
          data: {
            title: "Lean Coffee Trello Power-up",
            ...TEMPLATE_PARAMETERS,
          },
          import: "./templates/_index.eta",
          filename: "index.html",
        },
        {
          data: { title: "Lean Coffee Settings", ...TEMPLATE_PARAMETERS },
          import: "./templates/_settings.eta",
          filename: "settings.html",
        },
        {
          data: { title: "Discussion UI", ...TEMPLATE_PARAMETERS },
          import: "./templates/_discussion-ui.eta",
          filename: "discussion-ui.html",
        },
        {
          data: { title: "Ongoing or paused", ...TEMPLATE_PARAMETERS },
          import: "./templates/_ongoing_or_paused.eta",
          filename: "ongoing_or_paused.html",
        },
        {
          data: { title: "Release notes", ...TEMPLATE_PARAMETERS },
          import: "./templates/release-notes.eta",
          filename: "release-notes.html",
        },
        {
          data: { title: "Too many voets", ...TEMPLATE_PARAMETERS },
          import: "./templates/too_many_votes.eta",
          filename: "too_many_votes.html",
        },
        {
          data: { title: "Voters", ...TEMPLATE_PARAMETERS },
          import: "./templates/voters.eta",
          filename: "voters.html",
        },
      ],
      js: {
        filename: "[name].[fullhash].js",
      },
      integrity: "auto",
      minify: "auto",
      watchFiles: {
        paths: ["./src", "./templates", "./inline"],
      },
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
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
};
