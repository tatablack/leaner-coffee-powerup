import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenvx from "@dotenvx/dotenvx";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import { JSON_SCHEMA, load as yaml_load } from "js-yaml";
import { parseSemVer } from "semver-parser";
import webpack from "webpack";

import PACKAGE_JSON from "./package.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FOLDER = "../docs";

// Load configuration
dotenvx.config({
  strict: true,
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env",
});

const isProduction = process.env.NODE_ENV === "production";
const getVersion = () => {
  const { build, major, minor, patch, pre } = parseSemVer(process.env.VERSION);
  return `v${major}.${minor + 1}.${patch}${pre ? `-${pre[0].replace("-", ".")}` : ""}${build.length ? `+${build.join(".")}` : ""}`;
};

export const BUILDTIME_VERSION = isProduction
  ? PACKAGE_JSON.version
  : getVersion();

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
  POWERUP_LOADER: process.env.POWERUP_LOADER,
  ANALYTICS_TAG: `${process.env.NODE_ENV}_${BUILDTIME_VERSION}`.substring(
    0,
    50,
  ),
  BUILDTIME_VERSION,
  ENVIRONMENT: process.env.NODE_ENV,
};

const common = {
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
    new webpack.DefinePlugin({
      __BUILDTIME_VERSION__: JSON.stringify(BUILDTIME_VERSION),
    }),
    new webpack.EnvironmentPlugin({
      CONFIG: Config,
    }),

    new HtmlBundlerPlugin({
      preprocessorOptions: {
        useWith: false,
      },
      entry: [
        {
          data: { title: "Lean Coffee Trello Power-up" },
          import: "templates/_index.eta",
          filename: "index.html",
        },
        {
          data: { title: "Lean Coffee Settings" },
          import: "templates/_settings.eta",
          filename: "settings.html",
        },
        {
          data: { title: "Discussion UI" },
          import: "templates/_discussion-ui.eta",
          filename: "discussion-ui.html",
        },
        {
          data: { title: "Ongoing or paused" },
          import: "templates/_ongoing_or_paused.eta",
          filename: "ongoing_or_paused.html",
        },
        {
          data: { title: "Release notes" },
          import: "templates/release-notes.eta",
          filename: "release-notes.html",
        },
        {
          data: { title: "Too many votes" },
          import: "templates/too_many_votes.eta",
          filename: "too_many_votes.html",
        },
        {
          data: { title: "Voters" },
          import: "templates/voters.eta",
          filename: "voters.html",
        },
      ],
      js: {
        filename: "[name].[fullhash].js",
      },
      data: {
        ...TEMPLATE_PARAMETERS,
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
            ignore: isProduction ? ["**/umami*.js"] : ["**/listings/**/*"],
          },
        },
        {
          from: "i18n/*.yml",
          to: "i18n/[name].json",
          transform: (content) =>
            Buffer.from(
              JSON.stringify(
                yaml_load(content.toString("utf8"), {
                  schema: JSON_SCHEMA,
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

export default common;
