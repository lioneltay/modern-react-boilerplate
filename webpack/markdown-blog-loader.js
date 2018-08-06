module.exports = function(source) {
  const markdownString = JSON.stringify(source)
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")

  const string = JSON.parse(markdownString)

  const title = string
    .split("\n")[0]
    .replace(/^#*/, "")
    .replace(/"/g, `\\"`)
    .trim()

  const res = `
import * as React from "react"
import { Markdown } from "components"
import { Helmet } from "react-helmet"

export default class Blog extends React.Component {
  render() {
    return (
      <div>
        <Helmet title={"${title}"} />

        <Markdown source={${markdownString}} />
      </div>
    )
  }
}
`

  return res
}
