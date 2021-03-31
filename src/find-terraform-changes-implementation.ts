import * as core from '@actions/core'
import * as glob from '@actions/glob'
import orderBy from 'lodash-es/orderBy'
import uniq from 'lodash-es/uniq'
import { dirname } from 'path'
import { listFilesInPullRequest } from './utils'

function findClosest(path: string, prefixes: string[]): string | null {
  const orderedPrefixes = orderBy(prefixes, (p) => p.length, 'desc')
  for (const prefix of orderedPrefixes) {
    if (path.startsWith(prefix)) return prefix
  }
  return null
}

export function findAffectedModules({
  filesInPr,
  moduleDirs,
}: {
  filesInPr: string[]
  moduleDirs: string[]
}): string[] {
  const dirsInPr = uniq(filesInPr.map(dirname))
  return uniq(dirsInPr.map((dir) => findClosest(dir, moduleDirs))).filter(
    (path) => !!path
  ) as string[]
}

export async function findModules(marker: string) {
  core.debug(`Module marker: ${marker}`)
  const globber = await glob.create(`**/${marker}`)
  core.debug(`Search paths: ${globber.getSearchPaths().join()}`)
  const moduleHits = await globber.glob()
  return uniq(moduleHits.map(dirname))
}

export async function findTerraformChanges(): Promise<void> {
  const marker = core.getInput('marker')
  const moduleDirs = await findModules(marker)

  core.debug(`Found ${moduleDirs.length} Terraform modules in repo:`)
  for (const module of moduleDirs) {
    core.debug(module)
  }
  if (moduleDirs.length === 0) {
    core.warning(
      'Could not find any modules for the given marker; have you remembered to checkout the code?'
    )
  }

  const filesInPr = await listFilesInPullRequest()
  const modulesInPr = findAffectedModules({ filesInPr, moduleDirs })

  core.debug(`Found ${modulesInPr.length} Terraform affected modules:`)
  for (const module of modulesInPr) {
    core.debug(module)
  }

  const matrix = {
    include: Array.from(modulesInPr).map((path) => ({ path })),
  }

  core.setOutput('matrix', JSON.stringify(matrix))
}
