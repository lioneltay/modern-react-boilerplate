const path = require("path")
const webpack = require("webpack")
const WebpackStatsPlugin = require("./src/lib/async-component/webpack-stats-plugin")

const relativeToRoot = relativePath => path.resolve(__dirname, relativePath)

module.exports = [
  {
    mode: "development",
    entry: "./src/index.ts",
    target: "node",
    output: {
      filename: "bundle.js",
      chunkFilename: "[name].chunk.js",
      path: path.resolve(__dirname, "dist"),
    },
    resolve: {
      extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
      modules: [
        path.resolve(__dirname, relativeToRoot("./src")),
        "node_modules",
      ],
    },
    module: {
      rules: [
        {
          test: /.tsx?$/,
          loader: [
            "babel-loader",
            {
              loader: "ts-loader",
              options: { transpileOnly: true },
            },
          ],
        },
      ],
    },
    plugins: [new WebpackStatsPlugin()],
  },
]
