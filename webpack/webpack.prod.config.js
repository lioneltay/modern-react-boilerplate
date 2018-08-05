const path = require("path")
const webpack = require("webpack")
const webpackNodeExternals = require("webpack-node-externals")
const WebpackStatsPlugin = require("../src/lib/async-component/webpack-stats-plugin")

const relativeToRoot = relativePath =>
  path.resolve(__dirname, "../", relativePath)

const common = {
  mode: "production",
  resolve: {
    extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
    modules: [path.resolve(__dirname, relativeToRoot("./src")), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        exclude: /node_modules/,
        loader: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
          {
            loader: "ts-loader",
            options: { transpileOnly: false },
          },
        ],
      },
    ],
  },
}

module.exports = [
  {
    ...common,
    name: "client",
    target: "web",
    entry: relativeToRoot("./src/client/clientEntry.tsx"),
    output: {
      filename: "client.bundle.js",
      chunkFilename: "[name].chunk.js",
      path: relativeToRoot("./dist"),
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      new WebpackStatsPlugin({
        outputPath: relativeToRoot("./dist/clientStats.json"),
      }),
    ],
  },

  {
    ...common,
    name: "server",
    target: "node",
    entry: relativeToRoot("./src/server/serverEntry.tsx"),
    externals: [webpackNodeExternals()],
    output: {
      filename: "server.bundle.js",
      chunkFilename: "[name].chunk.js",
      path: relativeToRoot("./dist"),
      libraryTarget: "commonjs2",
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
    ],
  },
]
