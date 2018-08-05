import * as React from "react"
import { renderToString } from "react-dom/server"
import { Request, Response, NextFunction } from "express"

import HTML from "server/HTML"
import App from "App"

interface ServerRendererOptions {
  clientStats: any
  serverStats: any
}

export default function serverRenderer({
  clientStats,
  serverStats,
}: ServerRendererOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const appHtml = renderToString(<App />)

    res.send(renderToString(<HTML appHtml={appHtml} />))
  }
}
