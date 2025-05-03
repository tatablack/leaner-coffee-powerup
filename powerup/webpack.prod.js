const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  devtool: "source-map",

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!CNAME"],
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
});
