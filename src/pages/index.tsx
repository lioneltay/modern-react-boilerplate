import * as React from "react"

const initialState =  {
  count: 0
}

type State = Readonly<typeof initialState>
export default class RootPage extends React.Component<{}, State> {
  state = initialState

  render() {
    return (
      <div>
        <h1>Hello from the RootPage oyoyupdated</h1>
        <button onClick={() => this.setState({ count: this.state.count + 1})}>+</button>
        <div>{this.state.count}</div>
      </div>
    )
  }
}
