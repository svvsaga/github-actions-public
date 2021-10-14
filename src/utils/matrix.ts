import * as core from '@actions/core'
import last from 'lodash-es/last'
import { findAffectedFilesInPushOrPr } from './github'
import { findAffectedModules, findModules } from './modules'

export type PathMatrix = {
  include: {
    path: string
    segments: string[]
    folder: string
  }[]
}

export function createPathMatrix(paths: string[]): PathMatrix {
  return {
    include: paths.map((path) => {
      const segments = path.split('/').filter((x) => !!x)
      return {
        path,
        segments,
        folder: last(segments) || '',
      }
    }),
  }
}

export async function createMatrixForAffectedModules(
  marker: string,
  {
    ignoreModules = [],
    ignoreModulesRegex = '',
    cwd = '.',
    includeRemoved = false,
    includeAll = false,
  }: {
    ignoreModules?: string[]
    ignoreModulesRegex?: string
    cwd?: string
    includeRemoved?: boolean
    includeAll?: boolean
  } = {}
): Promise<{ matrix: PathMatrix; hasResults: boolean }> {
  const moduleDirs = await findModules(marker, {
    ignoreModules,
    ignoreModulesRegex: ignoreModulesRegex
      ? RegExp(ignoreModulesRegex)
      : undefined,
    cwd,
  })

  core.debug(`Found ${moduleDirs.length} modules in repo:`)
  for (const module of moduleDirs) {
    core.debug(module)
  }
  if (moduleDirs.length === 0) {
    core.warning(
      'Could not find any modules for the given marker; have you remembered to checkout the code?'
    )
  }

  let affectedModules: string[]

  if (includeAll) {
    affectedModules = moduleDirs
  } else {
    const affectedFiles = await findAffectedFilesInPushOrPr(includeRemoved)

    affectedModules = findAffectedModules({
      affectedFiles,
      moduleDirs,
      cwd,
    })
  }

  core.debug(`Found ${affectedModules.length} affected modules:`)
  for (const module of affectedModules) {
    core.debug(module)
  }

  const matrix = createPathMatrix(affectedModules)
  const hasResults = Boolean(affectedModules.length)
  return { matrix, hasResults }
}
