const fs = require("node:fs");
const path = require("node:path");

const { merge } = require("webpack-merge");

const common = require("./webpack.common");

module.exports = merge(common, {
  devtool: "inline-source-map",

  devServer: {
    allowedHosts: ["localhost", "trello.com", ".trello.com"],
    setupMiddlewares: (middlewares) => {
      return middlewares.filter(
        (middleware) => middleware.name !== "cross-origin-header-check",
      );
    },
    watchFiles: {
      paths: ["src/**/*.ts", "inline/**/*.eta", "templates/**/*.eta"],
      options: {
        usePolling: false,
      },
    },
    static: {
      watch: {
        ignored: ["error.png", "node_modules"].map((item) =>
          path.resolve(__dirname, item),
        ),
      },
    },
    open: process.env.OPEN_ON_START !== "false",
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
