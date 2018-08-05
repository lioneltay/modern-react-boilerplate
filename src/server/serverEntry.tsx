import * as React from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom"
import { Request, Response, NextFunction } from "express"
import { preloadAll, Reporter } from "lib/async-component"

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
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await preloadAll()

      const routerContext: StaticRouterContext = {}
      const sourcePaths: string[] = []

      const appHtml = renderToString(
        <StaticRouter location={req.url} context={routerContext}>
          <Reporter
            report={sourcePath => {
              sourcePaths.push(sourcePath)
            }}
          >
            <App />
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
          />
        )
      )
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
