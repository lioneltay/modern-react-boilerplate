const production = process.env.NODE_ENV === "production"

module.exports = production
  ? require("./webpack/webpack.prod.config")
  : require("./webpack/webpack.dev.config")
