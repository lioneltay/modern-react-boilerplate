import * as React from "react"
import { Switch, Route, Link } from "react-router-dom"
import { asyncComponent } from "lib/async-component"
import styled from "styled-components"
import { Helmet } from "react-helmet"

const BlogPage = asyncComponent({ loader: () => import("pages/blog") })
const EditorThemesPage = asyncComponent({
  loader: () => import("pages/editor-themes"),
})

const initialState = {
  count: 0,
}

interface BoxProps {
  highlighted: boolean
}

const Box = styled.div<BoxProps>`
  height: 50px;
  width: 50px;
  background: ${props => (props.highlighted ? "green" : "yellowgreen")};
  border: 1px dashed black;
`

type State = Readonly<typeof initialState>
class Content extends React.Component<{}, State> {
  state = initialState

  render() {
    return (
      <div>
        <h1>cool beans</h1>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          +
        </button>
        <div>{this.state.count}</div>

        <hr />

        <div style={{ display: "flex" }}>
          <Box highlighted={true} />
          <Box highlighted={false} />
          <Box highlighted={false} />
          <Box highlighted={true} />
        </div>
      </div>
    )
  }
}

const Header = styled.header`
  display: flex;
  justify-content: space-around;
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f3f3f3;
`

export default class RootPage extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Lionel Tay" />

        <Header>
          <Link to="/">Home</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/editor-themes">Editor Themes</Link>
        </Header>

        <Switch>
          <Route exact path="/" component={Content} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/editor-themes" component={EditorThemesPage} />
          <Route render={() => <div>Not Found</div>} />
        </Switch>
      </div>
    )
  }
}
