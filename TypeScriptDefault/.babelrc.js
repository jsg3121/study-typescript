const stripJsonComments = require('strip-json-comments')
const fs = require('fs')
const path = require('path')

/**
 * pluginPathAlias
 */
function pluginPath() {
  const tsConfigText = fs
    .readFileSync(path.resolve(__dirname, 'tsconfig.json'), 'utf-8')
    .toString()
  const tsConfig = JSON.parse(stripJsonComments(tsConfigText))
  const { compilerOptions } = tsConfig
  const root = [compilerOptions.baseUrl || '.']
  const paths = compilerOptions.paths || []
  const alias = {}

  function pathValueParser(pathStr) {
    if (typeof pathStr === 'string') {
      if (pathStr.indexOf('node_modules') === 0) {
        return pathStr
      }
      return `./${pathStr.replace(/\/\*$/, '')}`
    }
    return ''
  }

  Object.keys(paths).forEach((pathKey) => {
    const pathValue = paths[pathKey] //string or string array
    const outputKey = pathKey.replace(/\/\*$/, '')
    if (typeof pathValue === 'string') {
      alias[outputKey] = pathValueParser(pathValue)
    } else if (Array.isArray(pathValue)) {
      const innerValue = pathValue.find((v) => typeof v === 'string')
      if (innerValue) {
        alias[outputKey] = pathValueParser(innerValue)
      }
    }
  })

  return [
    'babel-plugin-module-resolver',
    {
      root,
      alias,
    },
  ]
}

const config = {
  presets: ['@babel/env', '@babel/typescript'],
  plugins: [
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    pluginPath(),
  ],
}

module.exports = config
