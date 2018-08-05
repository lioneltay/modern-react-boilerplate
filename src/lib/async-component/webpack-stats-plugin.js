const fs = require("fs")
const path = require("path")
const NAME = "MyPlugin"

module.exports = class MyPlugin {
  constructor(options) {
    if (!options.outputPath) {
      throw Error("outputPath is required")
    }

    this.outputPath = options.outputPath
  }

  apply(compiler) {
    compiler.hooks.done.tap(NAME, stats => {
      const json = stats.toJson()

      fs.writeFileSync(
        this.outputPath,
        JSON.stringify(json, null, 2)
      )

      console.log("Done")
    })
  }
}
