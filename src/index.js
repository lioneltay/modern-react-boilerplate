import {
  asyncComponent,
  extractIdentifiers,
  getChunkNames,
} from "./async-component"
const fs = require("fs")

const stats = JSON.parse(
  fs.readFileSync("/Users/lioneltay/dev/sandboxes/tapable/STATS.json", {
    encoding: "utf8",
  })
)

const cowModule = asyncComponent({
  loader: () => import("./cow"),
})

const mooModule = asyncComponent({
  loader: () => import("./moo"),
})

const deepModule = asyncComponent({
  loader: () => import("./nested/deep/deep-nested"),
})

deepModule()
cowModule()
mooModule()

setTimeout(() => {
  const identifiers = extractIdentifiers()

  const chunkNames = getChunkNames(stats, identifiers)

  console.log(identifiers)
  console.log(chunkNames)
}, 1000)
