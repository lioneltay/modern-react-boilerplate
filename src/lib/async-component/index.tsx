import * as React from "react"
import * as T from "lib/typedash"
import * as R from "ramda"

let moduleSourcePaths: string[] = []
interface LoaderMap {
  [sourcePath: string]: ComponentLoader
}
let loaderMap: LoaderMap = {}

function addSourcePaths(sourcePaths: string[]) {
  moduleSourcePaths = R.uniq(moduleSourcePaths.concat(sourcePaths))
}

function addLoader(sourcePath: string, loader: ComponentLoader): void {
  loaderMap[sourcePath] = loader
}

type ComponentLoader = () => Promise<
  React.ComponentType | { default: React.ComponentType }
>

interface AsyncComponentOptions {
  loader: ComponentLoader
  Loading?: React.ComponentType
  // sourcePaths is required, but will only be present after a babel transform
  sourcePaths?: string[]
}

function asyncComponent({
  sourcePaths: _sourcePaths,
  loader,
  Loading = (props: any) => null,
}: AsyncComponentOptions) {
  // sourcePaths will always be present after babel transform
  const sourcePaths = _sourcePaths as string[]

  let LoadedComponent: React.ComponentType | null = null

  /**
   * Run the ComponentLoader and save the result to LoadedComponent
   */
  async function loadComponent(): Promise<React.ComponentType> {
    if (!LoadedComponent) {
      const mod = await loader()
      if (typeof mod === "object") {
        LoadedComponent = mod.default
      } else {
        LoadedComponent = mod
      }
    }
    return LoadedComponent
  }

  sourcePaths.map(sourcePath => addLoader(sourcePath, loadComponent))

  return class AsyncComponent extends React.Component {
    loadedComponentUsedInRender = false

    constructor(props: any) {
      super(props)

      addSourcePaths(sourcePaths)

      loadComponent().then(() => {
        if (!this.loadedComponentUsedInRender) {
          this.forceUpdate()
        }
      })
    }

    render() {
      return (
        <ReporterContext.Consumer>
          {({ report }) => {
            if (!LoadedComponent) {
              return <Loading {...this.props} />
            }

            if (!this.loadedComponentUsedInRender) {
              sourcePaths.forEach(sourcePath => report(sourcePath))
            }
            this.loadedComponentUsedInRender = true

            return <LoadedComponent {...this.props} />
          }}
        </ReporterContext.Consumer>
      )
    }
  }
}

const ReporterContext = React.createContext({
  report: (sourcePath: string) => {},
})

interface ReporterProps {
  report: (sourcePath: string) => void
}

class Reporter extends React.Component<ReporterProps> {
  render() {
    return (
      <ReporterContext.Provider value={{ report: this.props.report }}>
        {this.props.children}
      </ReporterContext.Provider>
    )
  }
}

async function preloadAll(): Promise<void> {
  const loaders = Object.values(loaderMap)
  if (loaders.length === 0) {
    return
  }
  loaderMap = {}
  await Promise.all(loaders.map(loader => loader()))
  await preloadAll()
}

declare const __USED_SOURCE_PATHS__: string[]
async function preloadReady() {
  let sourcePathsToLoad = [...__USED_SOURCE_PATHS__]

  async function recursivePreload() {
    const theLoaders = sourcePathsToLoad.map(
      sourcePath => loaderMap[sourcePath]
    )
    if (theLoaders.length === 0) {
      return
    }
    sourcePathsToLoad = []
    await Promise.all(theLoaders.map(loader => loader()))
    await recursivePreload()
  }

  return recursivePreload()
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

/**
 * Get the chunks names that have been used.
 * These can go straight into the src of a script tag as is.
 */
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

export { asyncComponent, getChunkNames, Reporter, preloadAll, preloadReady }
