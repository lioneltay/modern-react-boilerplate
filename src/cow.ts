import { asyncComponent } from "lib/async-component"

console.log("cow required")

const nestedModule = asyncComponent({
  loader: () => import("./nested/nested"),
})

nestedModule()

export default () => {}
