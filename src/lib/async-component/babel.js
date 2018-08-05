const nodePath = require("path")
/**
 * OPTIONS
 * resolve: string - The relative path from root to source directory
 *  could potentially have multiple paths, would need to check that the file exists
 */

/**
 * paths that are not absolute or relative like node modules
 */
function resolveRequired(path) {
  return !(path.startsWith("./") || path.startsWith("/"))
}

function generateChunkName({ importPath, state }) {
  const sourceFilePath = state.file.opts.sourceFileName
  let chunkName = ""

  if (resolveRequired(sourceFilePath)) {
    if (!state.opts.resolve) {
      throw Error("resolve is required when using resolved paths in webpack")
    }

    chunkName = nodePath.join(state.opts.resolve, importPath)
  } else {
    chunkName = nodePath.join(sourceFilePath, "../", importPath)
  }

  return chunkName
}

module.exports = function({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        if (!path.node.source.value.endsWith("async-component")) {
          return
        }

        const specifier = path.node.specifiers.find(specifier => {
          return (
            specifier.type === "ImportSpecifier" &&
            specifier.imported.name === "asyncComponent"
          )
        })

        if (!specifier) {
          return
        }

        const bindingName = specifier.imported.name

        const binding = path.scope.getBinding(bindingName)

        binding.referencePaths.forEach(refPath => {
          const callExpressionPath = refPath.parentPath

          const optionsPath = callExpressionPath.get("arguments.0")

          if (!optionsPath || !optionsPath.isObjectExpression()) {
            return
          }

          const loaderIndex = optionsPath.node.properties.findIndex(
            prop => prop.key.name === "loader"
          )

          if (loaderIndex < 0) {
            return
          }

          const loaderPath = optionsPath.get(`properties.${loaderIndex}`)

          const loaderValuePath = loaderPath.get("value")

          if (!loaderValuePath) {
            return
          }

          const dynamicImportPaths = []

          loaderValuePath.traverse({
            Import(path) {
              const importPath = path.parent.arguments[0]

              if (importPath.type === "StringLiteral") {
                dynamicImportPaths.push(importPath.value)
              }
            },
          })

          loaderPath.insertAfter(
            t.objectProperty(
              t.identifier("sourcePaths"),
              t.arrayExpression(
                dynamicImportPaths.map(pathString =>
                  t.stringLiteral(
                    generateChunkName({
                      importPath: pathString,
                      state,
                    })
                  )
                )
              )
            )
          )
        })
      },

      /**
       * Add webpackChunkNames for better debuggability.
       * This also populated the assetsByChunkNames field in the webpack stats object.
       */
      Import(path, state) {
        const callExpressionPath = path.parentPath

        if (!callExpressionPath.isCallExpression) {
          return
        }

        if (callExpressionPath.node.callee.type === "Import") {
          const arg = callExpressionPath.get("arguments")[0]

          const { leadingComments } = arg.node

          if (
            leadingComments &&
            leadingComments.length > 0 &&
            leadingComments[0].value.indexOf("webpackChunkName") >= 0
          ) {
            return
          }

          const importPath = arg.node.value

          const chunkName = generateChunkName({ importPath, state })

          arg.addComment(
            "leading",
            ` webpackChunkName: '${chunkName.replace(/\//g, "__")}' `
          )
        }
      },
    },
  }
}
