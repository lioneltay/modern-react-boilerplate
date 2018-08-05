const R = require("ramda")
let ids = []

function ensureStartsWith(prefix, str) {
  return str.startsWith(prefix) ? str : `${prefix}${str}`
}

function asyncComponent(options) {
  return () => {
    ids = ids.concat(
      (options.sourcePaths || []).map(sourcePath => ensureStartsWith("./", sourcePath))
    )

    options.loader()
  }
}

function extractIdentifiers() {
  return ids
}

function getChunkNames(stats, ids) {
  function getModule(name, modules) {
    return modules.find(mod => new RegExp(`${name}\.*$`).test(mod.name))
  }

  function getChunk(id, chunks) {
    return chunks.find(chunk => chunk.id === id)
  }

  const usedModules = ids.map(name => getModule(name, stats.modules))

  const usedChunkIds = R.flatten(usedModules.map(mod => mod.chunks))

  const usedChunks = usedChunkIds.map(id => getChunk(id, stats.chunks))

  const usedFiles = R.flatten(usedChunks.map(chunk => chunk.files))

  return usedFiles
}

module.exports = {
  asyncComponent,
  extractIdentifiers,
  getChunkNames,
}
