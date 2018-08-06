import * as React from "react"
import * as Markdown from "react-markdown"
import * as R from "ramda"
import SyntaxHighlighter from "react-syntax-highlighter/prism"
import * as styles from "react-syntax-highlighter/styles/prism"
import { Helmet } from "react-helmet"

import markdownText from './test.md'

interface CodeBlockProps {
  value: string
  language: string
}

const codeBlocks = Object.keys(styles).map(styleName => {
  const style = styles[styleName]

  return class CodeBlock extends React.PureComponent<CodeBlockProps> {
    static defaultProps = {
      language: "typescript",
    }

    render() {
      const { language, value } = this.props

      return (
        <div>
          <strong>{styleName}</strong>
          <SyntaxHighlighter language={language} style={style}>
            {value}
          </SyntaxHighlighter>
        </div>
      )
    }
  }
})

export default class MarkdownDemo extends React.Component {
  render() {
    return (
      <div style={{ padding: 50 }}>
        <Helmet title="Editor Themes" />

        {codeBlocks.map(codeBlock => (
          <Markdown source={markdownText} renderers={{ code: codeBlock }} />
        ))}
      </div>
    )
  }
}
