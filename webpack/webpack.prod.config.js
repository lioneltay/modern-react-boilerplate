const relativeToRoot = relativePath =>
  path.resolve(__dirname, "../", relativePath)

const path = require("path")
const webpack = require("webpack")
const webpackNodeExternals = require("webpack-node-externals")
const { StatsWriterPlugin } = require("webpack-stats-plugin")
const { statsTransform } = require(relativeToRoot(
  "./src/lib/async-component/stats-transform"
))

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
            options: { transpileOnly: true },
          },
        ],
      },
      {
        test: /.md$/,
        loader: ["raw-loader"],
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
      publicPath: "/",
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      new StatsWriterPlugin({
        filename: "clientStats.json",
        fields: ["chunks", "modules"],
        transform: statsTransform,
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
      publicPath: "/",
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
