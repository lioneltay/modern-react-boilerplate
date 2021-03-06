require("colors")
const express = require("express")
const app = express()

const PRODUCTION = process.env.NODE_ENV === "production"

function startServer() {
  const PORT = process.env.PORT || 8000
  const mode = PRODUCTION ? "PRODUCTION" : "DEVELOPMENT"
  return new Promise(resolvePromise => {
    app.listen(PORT, () => {
      console.log(
        `\nServer listening at ${
          `http://localhost:${PORT}`.magenta.underline
        } in ${mode.green} mode.`
      )
      resolvePromise({ PORT })
    })
  })
}

/**
 * Serve public assets including favicons
 */
app.use("/public", express.static("./public"))

if (PRODUCTION) {
  /**
   * Serve dist assets
   */
  app.use(express.static("./dist"))

  const clientStats = require("./dist/clientStats.json")
  app.use(require("./dist/server.bundle").default({ clientStats }))

  startServer()
}

if (!PRODUCTION) {
  const webpack = require("webpack")
  const webpackDevMiddleware = require("webpack-dev-middleware")
  const webpackHotMiddleware = require("webpack-hot-middleware")
  const webpackHotServerMiddleware = require("webpack-hot-server-middleware")

  const webpackConfig = require("./webpack.config")
  const multiCompiler = webpack(webpackConfig)

  /**
   * Sets up a static file server that will server the latest assets generated by the webpack build
   */
  app.use(
    webpackDevMiddleware(multiCompiler, {
      logLevel: "error",
    })
  )

  /**
   * Sets up an endpoint that the HMR client knows how to connect to.
   * The endpoint sends the updated modules to the client.
   */
  app.use(
    webpackHotMiddleware(
      multiCompiler.compilers.find(compiler => compiler.name === "client")
    )
  )

  /**
   * A middleware that handles SSR rendering.
   * The middleware will hand the request to the latest middleware generated by compiling the server entry point.
   * This middleware is a catch all.
   */
  app.use(webpackHotServerMiddleware(multiCompiler))

  let serverStarted = false
  multiCompiler.hooks.done.tap("StartServer", () => {
    if (!serverStarted) {
      startServer()
    }
    serverStarted = true
  })
}
