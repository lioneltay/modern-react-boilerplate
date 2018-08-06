import * as React from "react"
import * as ReactMarkdown from "react-markdown"
import SyntaxHighlighter from "react-syntax-highlighter/prism"
import { prism } from "react-syntax-highlighter/styles/prism"

interface CodeProps {
  value: string
  language?: string
}

class Code extends React.PureComponent<CodeProps> {
  static defaultProps = {
    language: "tsx",
  }

  render() {
    return (
      <SyntaxHighlighter language={this.props.language} style={prism}>
        {this.props.value}
      </SyntaxHighlighter>
    )
  }
}

interface MarkdownProps {
  source: string
}

export default class Markdown extends React.Component<MarkdownProps> {
  render() {
    return (
      <ReactMarkdown source={this.props.source} renderers={{ code: Code }} />
    )
  }
}
