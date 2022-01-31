import { Config } from '@jest/types'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import stripJsonComments from 'strip-json-comments'
import { pathsToModuleNameMapper } from 'ts-jest'

const { compilerOptions } = JSON.parse(
  stripJsonComments(readFileSync(resolve(__dirname, 'tsconfig.json'), 'utf-8'))
)

const config: Config.InitialOptions = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  preset: 'ts-jest/presets/default-esm', // or other ESM presets
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
}

module.exports = config
