import { asyncComponent } from "lib/async-component"

console.log("deep-nested required")

const backdownModule = asyncComponent({
  loader: () => import("backdown"),
})

backdownModule()

export default () => {}
