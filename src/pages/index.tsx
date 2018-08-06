import * as React from "react"
import { Switch, Route, Link } from "react-router-dom"
import { asyncComponent } from "lib/async-component"
import styled from "styled-components"

const PromotionPage = asyncComponent({ loader: () => import("./promotion") })
const AboutPage = asyncComponent({ loader: () => import("pages/about") })

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
export default class RootPage extends React.Component<{}, State> {
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

        <div>
          <Link to="/about">About</Link>
          <Link to="/promotion">Promotion</Link>
        </div>

        <div style={{ display: "flex" }}>
          <Box highlighted={true} />
          <Box highlighted={false} />
          <Box highlighted={false} />
          <Box highlighted={true} />
        </div>

        <Switch>
          <Route path="/about" component={AboutPage} />
          <Route path="/promotion" component={PromotionPage} />
          <Route render={() => <div>Hello</div>} />
        </Switch>
      </div>
    )
  }
}
