const fs = require("node:fs");
const path = require("node:path");

const { merge } = require("webpack-merge");

const common = require("./webpack.common");

module.exports = merge(common, {
  devtool: "inline-source-map",

  devServer: {
    static: {
      watch: {
        ignored: ["error.png", "node_modules"].map((item) =>
          path.resolve(__dirname, item),
        ),
      },
    },
    open: true,
    compress: true,
    hot: true,
    liveReload: false,
    client: {
      logging: "info",
      overlay: true,
    },
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
