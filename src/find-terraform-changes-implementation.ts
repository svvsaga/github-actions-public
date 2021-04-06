import * as core from '@actions/core'
import * as github from '@actions/github'
import * as glob from '@actions/glob'
import difference from 'lodash-es/difference'
import last from 'lodash-es/last'
import orderBy from 'lodash-es/orderBy'
import uniq from 'lodash-es/uniq'
import { dirname } from 'path'
import { listFilesInPullRequest, listFilesInPush } from './utils'

function findClosest(path: string, prefixes: string[]): string | null {
  const orderedPrefixes = orderBy(prefixes, (p) => p.length, 'desc')
  for (const prefix of orderedPrefixes) {
    if (path.startsWith(prefix)) return prefix
  }
  return null
}

export function findAffectedModules({
  affectedFiles,
  moduleDirs,
}: {
  affectedFiles: string[]
  moduleDirs: string[]
}): string[] {
  const dirsInPr = uniq(affectedFiles.map((file) => `./${dirname(file)}`))
  return uniq(dirsInPr.map((dir) => findClosest(dir, moduleDirs))).filter(
    (path) => !!path
  ) as string[]
}

export async function findModules(
  marker: string,
  ignoreModules: string[] = []
): Promise<string[]> {
  core.debug(`Module marker: ${marker}`)
  const globber = await glob.create(`**/${marker}`)
  const searchPath = globber.getSearchPaths()[0]
  core.debug(`Search path: ${searchPath}`)
  const moduleHits = await globber.glob()
  const moduleDirs = uniq(
    moduleHits.map(dirname).map((dir) => dir.replace(searchPath, '.'))
  )
  return difference(moduleDirs, ignoreModules)
}

export async function findTerraformChanges(): Promise<void> {
  const marker = core.getInput('marker')
  const ignoreModules = (core.getInput('ignore_modules') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => !!s)
  const moduleDirs = await findModules(marker, ignoreModules)

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
      ? await listFilesInPullRequest()
      : github.context.eventName === 'push'
      ? await listFilesInPush()
      : null
  if (affectedFiles === null)
    throw new Error(`Unsupported webhook event: ${github.context.eventName}`)

  const affectedModules = findAffectedModules({ affectedFiles, moduleDirs })

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

  core.setOutput('matrix', JSON.stringify(matrix))
}
