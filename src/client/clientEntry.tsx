import * as React from "react"
import { preloadReady } from "lib/async-component"
import { BrowserRouter } from "react-router-dom"
import { hydrate } from "react-dom"
import App from "App"

async function init() {
  await preloadReady()
  hydrate(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("app")
  )
}

init()
