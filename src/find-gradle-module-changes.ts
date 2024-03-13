import * as core from '@actions/core'
import { createMatrixForAffectedModules } from './utils/matrix'
import { getIgnoreModules } from './utils/modules'

async function run(): Promise<void> {
  try {
    const includeAll = core.getInput('include_all').toLowerCase() === 'true'
    const ignoreModules = getIgnoreModules()
    const ignoreModulesRegex = core.getInput('ignore_modules_regex')
    const cwd = core.getInput('cwd') || '.'
    const { matrix, hasResults } = await createMatrixForAffectedModules(
      'gradle',
      {
        ignoreModules,
        ignoreModulesRegex,
        cwd,
        includeAll,
      }
    )

    core.setOutput('matrix', JSON.stringify(matrix))
    core.setOutput('has_results', hasResults)
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
