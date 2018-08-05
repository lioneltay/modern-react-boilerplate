import * as React from "react"

interface Props {
  appHtml: string
}

export default class HTML extends React.Component<Props> {
  render() {
    return (
      <html>
        <head>
          <title>Modern React Boilerplate</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>

        <body>
          <div
            id="app"
            dangerouslySetInnerHTML={{ __html: this.props.appHtml }}
          />
          <script src="client.bundle.js" />
        </body>
      </html>
    )
  }
}
