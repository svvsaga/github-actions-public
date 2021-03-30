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
}) {
  const dirsInPr = uniq(filesInPr.map(dirname))
  return uniq(dirsInPr.map((dir) => findClosest(dir, moduleDirs)))
}

export async function findTerraformChanges(): Promise<void> {
  const marker = core.getInput('marker')
  const globber = await glob.create(`**/${marker}`)
  const moduleHits = await globber.glob()
  const moduleDirs = moduleHits.map(dirname)
  const filesInPr = await listFilesInPullRequest()
  const modulesInPr = findAffectedModules({ filesInPr, moduleDirs })

  core.info(`Found ${modulesInPr.length} Terraform modules`)

  const matrix = {
    include: Array.from(modulesInPr).map((path) => ({ path })),
  }

  core.setOutput('matrix', JSON.stringify(matrix))
}
