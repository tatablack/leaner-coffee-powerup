const fs = require("fs");
const path = require("path");

const webpack = require("webpack");
const { merge } = require("webpack-merge");

const PACKAGE_JSON = require("./package.json");
const common = require("./webpack.common");

const Config = require("./config/config.dev");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
      CONFIG: Config,
      VERSION: PACKAGE_JSON.version,
    }),
  ],

  devServer: {
    static: {
      watch: {
        ignored: ["error.png", "dist", "node_modules"].map((item) =>
          path.resolve(__dirname, item),
        ),
      },
    },
    open: true,
    client: {
      logging: "info",
    },
    liveReload: false,
    devMiddleware: {
      publicPath: "/",
      stats: "errors-warnings",
    },
    server: {
      type: "https",
      options: {
        key: fs.readFileSync("localhost.key"),
        cert: fs.readFileSync("localhost.cert"),
      },
    },
  },
});
