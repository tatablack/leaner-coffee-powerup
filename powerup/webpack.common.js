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

const TEMPLATES = {
  // We need to sanitise the release name to avoid issues with Sentry. See:
  // https://github.com/getsentry/relay/blob/3df33b87bbbf71d65a74e285e3a43853da5ea1d9/relay-event-schema/src/protocol/event.rs#L321-L327
  SentryDefaultOptions: {
    sendDefaultPii: false,
    release: process.env.VERSION.replaceAll(/[^a-zA-Z0-9_.-]/g, "-"),
    environment: process.env.NODE_ENV,
  },

  sanitiseUrl: (urlString) => {
    const url = new URL(urlString);
    return (
      url.protocol +
      url.hostname +
      (url.port ? `:${url.port}` : "") +
      url.pathname
    );
  },

  beforeSend: (event, payload) => {
    // eslint-disable-next-line no-undef
    const url = sanitiseUrl(payload.url);
    return {
      ...payload,
      ...{
        // eslint-disable-next-line no-undef
        referrer: window.LeanerCoffeeAnalyticsReferrer,
        // eslint-disable-next-line no-undef
        hostname: window.LeanerCoffeeAnalyticsHostname,
      },
      url,
    };
  },
};

const TEMPLATE_PARAMETERS = {
  SENTRY_LOADER: process.env.SENTRY_LOADER,
  UMAMI_LOADER: process.env.UMAMI_LOADER,
  SENTRY_DEFAULT_OPTIONS: JSON.stringify(TEMPLATES.SentryDefaultOptions),
  ANALYTICS_SANITISE_URL: TEMPLATES.sanitiseUrl.toString(),
  ANALYTICS_BEFORE_SEND: TEMPLATES.beforeSend.toString(),
  ANALYTICS_TAG: `${process.env.NODE_ENV}_${process.env.VERSION}`.substring(
    0,
    50,
  ),
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
    }),

    new HtmlWebpackPlugin({
      title: "Lean Coffee Trello Power-up",
      template: "_index.html",
      filename: "index.html",
      chunks: ["main"],
      templateParameters: TEMPLATE_PARAMETERS,
    }),
    new HtmlWebpackPlugin({
      title: "Lean Coffee Settings",
      template: "_settings.html",
      filename: "settings.html",
      chunks: ["settings"],
      templateParameters: TEMPLATE_PARAMETERS,
    }),
    new HtmlWebpackPlugin({
      title: "Discussion UI",
      template: "_discussion-ui.html",
      filename: "discussion-ui.html",
      chunks: ["discussion_ui"],
      templateParameters: TEMPLATE_PARAMETERS,
    }),
    new HtmlWebpackPlugin({
      title: "Ongoing or paused",
      template: "_ongoing_or_paused.html",
      filename: "ongoing_or_paused.html",
      chunks: ["ongoing_or_paused"],
      templateParameters: TEMPLATE_PARAMETERS,
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
                .replace("SENTRY_LOADER", process.env.SENTRY_LOADER)
                .replace("UMAMI_LOADER", process.env.UMAMI_LOADER)
                .replace("ANALYTICS_TAG", process.env.NODE_ENV)
                .replace(
                  "SENTRY_DEFAULT_OPTIONS",
                  JSON.stringify(TEMPLATES.SentryDefaultOptions),
                )
                .replace(
                  "ANALYTICS_SANITISE_URL",
                  TEMPLATES.sanitiseUrl.toString(),
                )
                .replace(
                  "ANALYTICS_BEFORE_SEND",
                  TEMPLATES.beforeSend.toString(),
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
