import {
  asyncComponent,
  extractIdentifiers,
  getChunkNames,
} from "./lib/async-component"
import * as fs from "fs"

console.log("index required")

const stats = JSON.parse(
  fs.readFileSync(
    "/Users/lioneltay/dev/projects/modern-react-boilerplate/dist/STATS.json",
    {
      encoding: "utf8",
    }
  )
)

const cowModule = asyncComponent({
  loader: () => import("cow"),
})

const mooModule = asyncComponent({
  loader: () => import("moo"),
})

const deepModule = asyncComponent({
  loader: () => import("nested/deep/deep-nested"),
})

deepModule()
cowModule()
mooModule()

setTimeout(() => {
  const identifiers = extractIdentifiers()

  const chunkNames = getChunkNames(stats, identifiers)

  // console.log(identifiers)
  console.log(chunkNames)
}, 2000)
