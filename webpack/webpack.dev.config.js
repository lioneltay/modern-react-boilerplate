const path = require("path")
const webpack = require("webpack")
const WebpackStatsPlugin = require("../src/lib/async-component/webpack-stats-plugin")

const relativeToRoot = relativePath =>
  path.resolve(__dirname, "../", relativePath)

module.exports = [
  {
    name: "client",
    mode: "development",
    entry: [
      relativeToRoot("./src/client/clientEntry.tsx"),
      "webpack-hot-middleware/client",
    ],
    target: "web",
    output: {
      filename: "client.bundle.js",
      chunkFilename: "[name].chunk.js",
      path: relativeToRoot("./dist"),
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
    plugins: [
      new WebpackStatsPlugin({
        outputPath: relativeToRoot("./dist/STATS.json"),
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  },

  {
    name: "server",
    mode: "development",
    entry: relativeToRoot("./src/server/serverEntry.tsx"),
    target: "node",
    output: {
      filename: "server.bundle.js",
      chunkFilename: "[name].chunk.js",
      path: relativeToRoot("./dist"),
      libraryTarget: "commonjs2",
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
    plugins: [
      new WebpackStatsPlugin({
        outputPath: relativeToRoot("./dist/STATS.json"),
      }),
    ],
  },
]
