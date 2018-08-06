function getChunks(stats) {
  return stats.chunks.map(chunk => ({
    id: chunk.id,
    files: chunk.files,
  }))
}

function getModules(stats) {
  return stats.modules.map(mod => ({
    name: mod.name,
    chunks: mod.chunks,
  }))
}

function statsTransform(stats) {
  return JSON.stringify({
    chunks: getChunks(stats),
    modules: getModules(stats),
  })
}

module.exports = {
  statsTransform,
}
