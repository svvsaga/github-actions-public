import * as core from '@actions/core'
import * as github from '@actions/github'
import * as glob from '@actions/glob'
import difference from 'lodash-es/difference'
import last from 'lodash-es/last'
import orderBy from 'lodash-es/orderBy'
import uniq from 'lodash-es/uniq'
import { dirname, join, normalize } from 'path'
import { listFilesInPullRequest, listFilesInPush } from './utils'

function findClosest(path: string, prefixes: string[]): string | null {
  const orderedPrefixes = orderBy(prefixes, (p) => p.length, 'desc').map(
    (dir) => relativizePath(dir)
  )
  const relativePath = relativizePath(path)
  for (const prefix of orderedPrefixes) {
    if (relativePath.startsWith(prefix)) return prefix
  }
  return null
}

function relativizePath(path: string, prefix = '.'): string {
  return path.startsWith(prefix) ? path : `${prefix}/${path}`
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
  const dirsInPr = uniq(affectedFiles.map(dirname)).map(normalize)
  const affectedModules = uniq(
    dirsInPr.map((dir) =>
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

export async function findTerraformChanges(): Promise<void> {
  const marker = core.getInput('marker')
  if (!marker) {
    throw new Error('No module marker specified')
  }
  const ignoreModules = core
    .getInput('ignore_modules')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => !!s)
  const ignoreModulesRegex = core.getInput('ignore_modules_regex')
  const cwd = core.getInput('cwd') || '.'
  const moduleDirs = await findModules(marker, {
    ignoreModules,
    ignoreModulesRegex: ignoreModulesRegex
      ? RegExp(ignoreModulesRegex)
      : undefined,
    cwd,
  })

  core.debug(`Found ${moduleDirs.length} Terraform modules in repo:`)
  for (const module of moduleDirs) {
    core.debug(module)
  }
  if (moduleDirs.length === 0) {
    core.warning(
      'Could not find any modules for the given marker; have you remembered to checkout the code?'
    )
  }

  const affectedFiles =
    github.context.eventName === 'pull_request'
      ? await listFilesInPullRequest(true)
      : github.context.eventName === 'push'
      ? await listFilesInPush(true)
      : null
  if (affectedFiles === null)
    throw new Error(`Unsupported webhook event: ${github.context.eventName}`)

  const affectedModules = findAffectedModules({
    affectedFiles,
    moduleDirs,
    cwd,
  })

  core.debug(`Found ${affectedModules.length} affected Terraform modules:`)
  for (const module of affectedModules) {
    core.debug(module)
  }

  const matrix = {
    include: Array.from(affectedModules).map((path) => {
      const segments = path.split('/').filter((x) => !!x)
      return {
        path,
        segments,
        folder: last(segments),
      }
    }),
  }

  core.setOutput('matrix', matrix)
  core.setOutput('has_results', Boolean(affectedModules.length))
}
