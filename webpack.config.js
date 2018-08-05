const path = require("path")
const webpack = require("webpack")
const MyPlugin = require("./plugins/MyPlugin")

const fromRoot = relativePath => path.resolve(__dirname, relativePath)

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  target: "node",
  output: {
    filename: "bundle.js",
    chunkFilename: "[name].chunk.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /.js$/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new MyPlugin(),
  ],
}
