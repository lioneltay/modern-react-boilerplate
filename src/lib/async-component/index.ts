import * as T from "lib/typedash"

let moduleSourcePaths: string[] = []

function ensureStartsWith(prefix: string, str: string) {
  return str.startsWith(prefix) ? str : `${prefix}${str}`
}

interface AsyncComponentOptions {
  loader: () => Promise<any>
  sourcePaths?: string[]
}

function asyncComponent(options: AsyncComponentOptions) {
  return () => {
    moduleSourcePaths = moduleSourcePaths.concat(
      (options.sourcePaths || []).map(sourcePath =>
        ensureStartsWith("./", sourcePath)
      )
    )

    options.loader()
  }
}

function extractIdentifiers() {
  return moduleSourcePaths
}

interface Chunk {
  id: string | number
  files: string[]
}

interface Module {
  name: string
  chunks: Chunk["id"][]
}

function getChunkNames(stats: any, ids: string[]) {
  function getModule(name: string, modules: Module[]): Module | undefined {
    return modules.find(mod => new RegExp(`${name}\.*$`).test(mod.name))
  }

  function getChunk(id: string | number, chunks: Chunk[]): Chunk | undefined {
    return chunks.find(chunk => chunk.id === id)
  }

  const usedModules = ids
    .map(name => getModule(name, stats.modules))
    .filter(T.notEmpty)

  const usedChunkIds = T.flatten(usedModules.map(mod => mod.chunks))

  const usedChunks = usedChunkIds
    .map(id => getChunk(id, stats.chunks))
    .filter(T.notEmpty)

  const usedFiles = T.flatten(usedChunks.map(chunk => chunk.files))

  return usedFiles
}

export { asyncComponent, extractIdentifiers, getChunkNames }
