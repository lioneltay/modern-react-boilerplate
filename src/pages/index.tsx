import * as React from "react"
import { Switch, Route, Redirect} from "react-router-dom"
import { asyncComponent } from "lib/async-component"
import styled from "styled-components"
import { Helmet } from "react-helmet"

const BlogPage = asyncComponent({ loader: () => import("pages/blog") })
const EditorThemesPage = asyncComponent({
  loader: () => import("pages/editor-themes"),
})

const CardGrid = styled.div`
  margin: 20px auto;
  max-width: 800px;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr;
`

const Card = styled.div`
  height: 150px;
  background: white;
  padding: 15px;

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;

  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`

interface GoCardProps {
  to: string
}

const GoCard: React.SFC<GoCardProps> = ({ to, children }) => (
  <Route
    render={({ history }) => (
      <Card onPointerDown={() => history.push(to)}>{children}</Card>
    )}
  />
)

class Content extends React.Component {
  render() {
    return (
      <div>
        <CardGrid>
          <GoCard to="/editor-themes">
            <h3>Editor Themes</h3>
          </GoCard>
          <GoCard to="/blog/mapped-types">
            <h3>Blog: Mapped Types</h3>
          </GoCard>
          <GoCard to="/blog/typescript-extends">
            <h3>Blog: Typescript Extends</h3>
          </GoCard>
        </CardGrid>
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

        {/* <Header>
          <Link to="/">Home</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/editor-themes">Editor Themes</Link>
        </Header> */}

        <Switch>
          {/* <Route exact path="/" component={Content} /> */}
          <Route exact path="/" render={() => <Redirect to="/blog" />} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/editor-themes" component={EditorThemesPage} />
          <Route render={() => <div>Not Found</div>} />
        </Switch>
      </div>
    )
  }
}
