const fs = require("fs")
const path = require("path")
const NAME = "MyPlugin"

module.exports = class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap(NAME, stats => {
      const json = stats.toJson()

      fs.writeFileSync(
        path.resolve(__dirname, "../STATS.json"),
        JSON.stringify(json, null, 2)
      )

      console.log("Done")
    })
  }
}
