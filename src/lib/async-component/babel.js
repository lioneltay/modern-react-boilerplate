const nodePath = require("path")

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

          const sourceFilePath = state.file.opts.sourceFileName
          loaderPath.insertAfter(
            t.objectProperty(
              t.identifier("sourcePaths"),
              t.arrayExpression(
                dynamicImportPaths.map(pathString =>
                  t.stringLiteral(
                    nodePath.join(sourceFilePath, "../", pathString)
                  )
                )
              )
            )
          )
        })
      },

      /**
       * Add webpackChunkNames for better debuggability
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

          const sourceFilePath = state.file.opts.sourceFileName
          const pathString = arg.node.value
          const chunkName = nodePath
            .join(sourceFilePath, "../", pathString)
            .replace(/\//g, "__")

          arg.addComment("leading", ` webpackChunkName: '${chunkName}' `)
        }
      },
    },
  }
}
