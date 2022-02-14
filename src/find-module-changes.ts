import * as core from '@actions/core'
import { createMatrixForAffectedModules } from './utils/matrix'
import { getIgnoreModules } from './utils/modules'

async function run(): Promise<void> {
  try {
    const marker = core.getInput('marker')
    const includeRemoved =
      core.getInput('include_removed').toLowerCase() === 'true'
    const includeAll = core.getInput('include_all').toLowerCase() === 'true'
    const ignoreModules = getIgnoreModules()
    const ignoreModulesRegex = core.getInput('ignore_modules_regex')
    const cwd = core.getInput('cwd') || '.'
    const { matrix, hasResults } = await createMatrixForAffectedModules(
      marker,
      {
        ignoreModules,
        ignoreModulesRegex,
        cwd,
        includeAll,
        includeRemoved,
      }
    )

    core.setOutput('matrix', JSON.stringify(matrix))
    core.setOutput('has_results', hasResults)
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
