import * as core from '@actions/core'
import * as glob from '@actions/glob'
import difference from 'lodash-es/difference'
import uniq from 'lodash-es/uniq'
import { dirname, join, normalize } from 'path'
import { findClosest, relativizePath } from './path'

export function getIgnoreModules(): string[] {
  return core
    .getInput('ignore_modules')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => !!s)
}

export async function findModules(
  marker: string,
  {
    ignoreModules = [],
    ignoreModulesRegex = undefined,
    cwd = '.',
  }: {
    ignoreModules?: string[]
    ignoreModulesRegex?: RegExp | undefined
    cwd?: string
  } = {}
): Promise<string[]> {
  core.debug(`Module marker: ${marker}`)
  core.debug(`cwd: ${cwd}`)
  const globber = await glob.create(`${cwd}/**/${marker}`)
  const searchPath = globber.getSearchPaths()[0]
  core.debug(`Search path: ${searchPath}`)
  const moduleHits = await globber.glob()
  const moduleDirs = uniq(
    moduleHits
      .map(dirname)
      .filter((dir) => !ignoreModulesRegex || !ignoreModulesRegex.test(dir))
      .map((dir) => dir.replace(searchPath, '.'))
  )
  return difference(moduleDirs, ignoreModules)
}

export function findAffectedModules({
  affectedFiles,
  moduleDirs,
  cwd = '.',
}: {
  affectedFiles: string[]
  moduleDirs: string[]
  cwd?: string
}): string[] {
  const affectedDirs = uniq(affectedFiles.map(dirname)).map(normalize)
  const affectedModules = uniq(
    affectedDirs.map((dir) =>
      findClosest(
        dir,
        moduleDirs.map((moduleDir) => join(cwd, moduleDir))
      )
    )
  ).filter((path) => path != null) as string[]

  return affectedModules.map((module) =>
    module.replace(RegExp(`^${relativizePath(cwd)}`), '.')
  )
}
