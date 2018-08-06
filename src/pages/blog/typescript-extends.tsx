import * as React from "react"
import { Markdown } from "components"
import { Helmet } from "react-helmet"

import markdown from "./typescript-extends.md"

export default class TypescriptExtendsBlog extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Typescript: Extends" />

        <Markdown source={markdown} />
      </div>
    )
  }
}
