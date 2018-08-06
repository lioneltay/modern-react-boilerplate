import * as React from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom"
import { Request, Response, NextFunction } from "express"
import { preloadAll, Reporter } from "lib/async-component"
import { ServerStyleSheet, StyleSheetManager } from "styled-components"

import HTML from "server/HTML"
import App from "App"

interface ServerRendererOptions {
  clientStats: any
  serverStats: any
}

interface StaticRouterContext {
  action?: "REPLACE"
  location?: object
  url?: string
}

export default function serverRenderer({
  clientStats,
  serverStats,
}: ServerRendererOptions) {
  /**
   * The middleware that handles SSR logic
   */
  async function renderer(req: Request, res: Response, next: NextFunction) {
    await preloadAll()

    const routerContext: StaticRouterContext = {}
    const sourcePaths: string[] = []
    const styleSheet = new ServerStyleSheet()

    const appHtml = renderToString(
      <StaticRouter location={req.url} context={routerContext}>
        <Reporter
          report={sourcePath => {
            sourcePaths.push(sourcePath)
          }}
        >
          <StyleSheetManager sheet={styleSheet.instance}>
            <App />
          </StyleSheetManager>
        </Reporter>
      </StaticRouter>
    )

    if (
      routerContext.action === "REPLACE" &&
      typeof routerContext.url === "string"
    ) {
      return res.redirect(routerContext.url)
    }

    res.send(
      renderToString(
        <HTML
          clientStats={clientStats}
          serverStats={serverStats}
          appHtml={appHtml}
          sourcePaths={sourcePaths}
          styleElements={styleSheet.getStyleElement()}
        />
      )
    )
  }

  /**
   * Wrapper middleware that delegates to the SSR renderer.
   * Formats any errors and send it to the browser.
   */
  return async function(req: Request, res: Response, next: NextFunction) {
    try {
      await renderer(req, res, next)
    } catch (e) {
      console.log(e)
      return res.send(`
        <div>
          <strong>Error during server side render.</strong>
          <hr/>
          <div>
            ${e.toString()}
          </div>
        </div>
      `)
    }
  }
}
