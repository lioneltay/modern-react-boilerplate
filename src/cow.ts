import { asyncComponent } from "lib/async-component/index"

console.log("cow.js")

const nestedModule = asyncComponent({
  loader: () => import("./nested/nested"),
})

nestedModule()
