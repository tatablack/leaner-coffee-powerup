const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");

const PACKAGE_JSON = require("./package.json");
const common = require("./webpack.common.js");

const Config = require("./config/config.prod.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!CNAME"],
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: "production",
      CONFIG: Config,
      VERSION: PACKAGE_JSON.version,
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
});
