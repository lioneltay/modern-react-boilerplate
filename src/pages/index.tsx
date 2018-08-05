import * as React from "react"
import { Switch, Route, Link } from "react-router-dom"
import { asyncComponent } from "lib/async-component"

const PromotionPage = asyncComponent({ loader: () => import("./promotion") })
// const AboutPage = asyncComponent({ loader: () => import("./about") })
// const PromotionPage = asyncComponent({ loader: () => import("pages/promotion") })
const AboutPage = asyncComponent({ loader: () => import("pages/about") })

const initialState = {
  count: 0,
}

type State = Readonly<typeof initialState>
export default class RootPage extends React.Component<{}, State> {
  state = initialState

  render() {
    return (
      <div>
        <h1>Hello from the RootPage woot</h1>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          +
        </button>
        <div>{this.state.count}</div>

        <hr />

        <div>
          <Link to="/about">About</Link>
          <Link to="/promotion">Promotion</Link>
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
