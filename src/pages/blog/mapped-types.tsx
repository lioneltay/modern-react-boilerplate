import * as React from "react"
import { Markdown } from "components"
import { Helmet } from "react-helmet"

import markdown from "./mapped-types.md"

export default class MappedTypesBlog extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Typescript: Mapped Types" />

        <Markdown source={markdown} />
      </div>
    )
  }
}
