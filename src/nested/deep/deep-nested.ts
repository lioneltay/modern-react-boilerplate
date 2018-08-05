import { asyncComponent } from "lib/async-component/index"

console.log("nested.js was required")

const backdownModule = asyncComponent({
  loader: () => import("backdown"),
})

backdownModule()
