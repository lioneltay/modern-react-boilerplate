import * as React from "react"
import { Link, Route } from "react-router-dom"
import styled from "styled-components"
import { Helmet } from "react-helmet"
import { asyncComponent } from "lib/async-component"

const MappedTypesPage = asyncComponent({
  loader: () => import("./mapped-types.blog.md"),
})
const TypescriptExtendsPage = asyncComponent({
  loader: () => import("./typescript-extends.blog.md"),
})

const BlogLinks = styled.div`
  display: flex;
  flex-direction: column;
`

class Content extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Lionel Tay - Blog" />

        <h1>Blog</h1>

        <BlogLinks>
          <Link to="/blog/mapped-types">Typescript: Mapped Types</Link>
          <Link to="/blog/typescript-extends">Typecript: Extends</Link>
        </BlogLinks>
      </div>
    )
  }
}

const Container = styled.div`
  max-width: 800px;
  margin: 15px auto;
`

export default class BlogPage extends React.Component {
  render() {
    return (
      <Container>
        <Route path="/blog/*" render={() => <Link to="/blog">Back</Link>} />

        <Route exact path="/blog" component={Content} />
        <Route path="/blog/mapped-types" component={MappedTypesPage} />
        <Route
          path="/blog/typescript-extends"
          component={TypescriptExtendsPage}
        />
      </Container>
    )
  }
}
