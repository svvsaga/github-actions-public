const { readFileSync } = require('fs')
const { resolve } = require('path')
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const stripJsonComments = require('strip-json-comments')

const { compilerOptions } = JSON.parse(
  stripJsonComments(readFileSync(resolve(__dirname, 'tsconfig.json'), 'utf-8'))
)

module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  verbose: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  transformIgnorePatterns: ['/node_modules/(?!lodash-es)'],
}
