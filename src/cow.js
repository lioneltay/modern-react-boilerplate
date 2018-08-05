import { asyncComponent } from "./async-component"

console.log("cow.js")

const nestedModule = asyncComponent({
  loader: () => import("./nested/nested.js"),
})

nestedModule()
