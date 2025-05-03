const fs = require("fs");
const path = require("path");

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
