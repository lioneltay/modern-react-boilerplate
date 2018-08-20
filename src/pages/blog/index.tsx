import * as React from "react"
import { Link, Route } from "react-router-dom"
import styled from "styled-components"
import { Helmet } from "react-helmet"
import { blogs } from "./blogs"
import { format } from "date-fns"

const BlogLinks = styled.div`
  display: flex;
  flex-direction: column;
`

class Content extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Lionel Tay - Blog" />

        {/* <h1>Blog</h1> */}

        <BlogLinks>
          {blogs.map(blog => (
            <div>
              <span>{format(blog.date, "DD/MM/YY")}:</span>

              <Link key={blog.route} to={blog.route}>
                {blog.label}
              </Link>
            </div>
          ))}
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
        {blogs.map(blog => (
          <Route
            key={blog.route}
            path={blog.route}
            component={blog.component}
          />
        ))}
      </Container>
    )
  }
}
