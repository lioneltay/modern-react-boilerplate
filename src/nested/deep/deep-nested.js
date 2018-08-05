import { asyncComponent } from "../../async-component"

console.log("nested.js was required")

const backdownModule = asyncComponent({
  loader: () => import("../../backdown"),
})

backdownModule()
