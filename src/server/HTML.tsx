import * as React from "react"
import { getChunkNames } from "lib/async-component"

interface Props {
  clientStats: any
  serverStats: any
  appHtml: string
  sourcePaths: string[]
}

export default class HTML extends React.Component<Props> {
  faviconLinks() {
    return (
      <>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/public/favicon/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/public/favicon/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/public/favicon/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/public/favicon/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/public/favicon/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/public/favicon/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/public/favicon/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/public/favicon/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/public/favicon/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/public/favicon/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/public/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/public/favicon/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/public/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/public/favicon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/public/favicon/ms-icon-144x144.png"
        />
        <meta name="theme-color" content="#ffffff" />
      </>
    )
  }

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

          {this.faviconLinks()}
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
