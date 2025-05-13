import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { merge } from "webpack-merge";

import common from "./webpack.common.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = merge(common, {
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

export default dev;
