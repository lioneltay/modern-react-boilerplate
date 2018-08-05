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

interface Stats {
  chunks: Chunk[]
  modules: Module[]
  assetsByChunkName: AssetsByChunkName
}

interface Chunk {
  // ids will be numbers unless webpackChunkName magic comment is used
  id: string
  files: string[]
}

interface AssetsByChunkName {
  [chunkName: string]: undefined | string | string[]
}

interface Module {
  name: string
  chunks: Chunk["id"][]
}

function getChunkNames(stats: Stats, moduleNames: string[]) {
  function getModule(moduleName: string, stats: Stats): Module | undefined {
    return stats.modules.find(mod =>
      new RegExp(`${moduleName}\.*$`).test(mod.name)
    )
  }

  function getModules(names: string[], stats: Stats): Module[] {
    return names
      .map(moduleName => getModule(moduleName, stats))
      .filter(T.notEmpty)
  }

  function getChunkAssets(
    chunkName: string,
    stats: Stats
  ): string[] | undefined {
    const assets = stats.assetsByChunkName[chunkName]
    return assets === undefined
      ? undefined
      : Array.isArray(assets)
        ? assets
        : [assets]
  }

  function getAllChunkAssets(chunkNames: string[], stats: Stats): string[] {
    return T.flatten(
      chunkNames
        .map(chunkName => getChunkAssets(chunkName, stats))
        .filter(T.notEmpty)
    )
  }

  const usedModules = getModules(moduleNames, stats)

  const usedChunkNames = T.flatten(usedModules.map(mod => mod.chunks))

  const assets = getAllChunkAssets(usedChunkNames, stats)

  return assets
}

export { asyncComponent, extractIdentifiers, getChunkNames }
