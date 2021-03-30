import * as core from '@actions/core'
import * as glob from '@actions/glob'
import intersection from 'lodash-es/intersection'
import uniq from 'lodash-es/uniq'
import { dirname } from 'path'
import { listFilesInPullRequest } from './utils'

async function run(): Promise<void> {
  try {
    const globInput = core.getInput('glob')
    const globber = await glob.create(globInput)
    const modulePaths = await globber.glob()
    const moduleDirs = uniq(modulePaths.map(dirname))
    const filesInPr = await listFilesInPullRequest()
    const dirsInPr = uniq(filesInPr.map(dirname))
    const modulesInPr = intersection(moduleDirs, dirsInPr)
    core.info(`Found ${modulesInPr.length} Terraform modules`)

    const matrix = {
      include: Array.from(modulesInPr).map((path) => ({ path })),
    }

    core.setOutput('matrix', JSON.stringify(matrix))
  } catch (error) {
    core.setFailed(error)
  }
}

void run()
