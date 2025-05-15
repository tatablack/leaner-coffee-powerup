import { sentryWebpackPlugin } from "@sentry/webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { merge } from "webpack-merge";

import common, { BUILDTIME_VERSION } from "./webpack.common.js";

const prod = merge(common, {
  devtool: "source-map",

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!CNAME"],
    }),
    sentryWebpackPlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      debug: true,
      release: { name: BUILDTIME_VERSION, inject: false },
      disable: process.env.SENTRY_SOURCEMAPS_DISABLED === "true",
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
});

export default prod;
