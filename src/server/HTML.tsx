import * as React from "react"
import { getChunkNames } from "lib/async-component"

interface Props {
  clientStats: any
  serverStats: any
  appHtml: string
  sourcePaths: string[]
}

export default class HTML extends React.Component<Props> {
  render() {
    return (
      <html>
        <head>
          <title>Modern React Boilerplate</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__USED_SOURCE_PATHS__ = ${JSON.stringify(
                this.props.sourcePaths
              )}`,
            }}
          />
        </head>

        <body>
          <div
            id="app"
            dangerouslySetInnerHTML={{ __html: this.props.appHtml }}
          />

          {getChunkNames(this.props.clientStats, this.props.sourcePaths).map(
            chunkName => <script key={chunkName} src={chunkName} />
          )}
          <script src="client.bundle.js" />
        </body>
      </html>
    )
  }
}
