import * as core from '@actions/core'
import { createMatrixForAffectedModules, getIgnoreModules } from './utils'

async function run(): Promise<void> {
  try {
    const includeAll = core.getBooleanInput('include_all')
    const ignoreModules = getIgnoreModules()
    const ignoreModulesRegex = core.getInput('ignore_modules_regex')
    const cwd = core.getInput('cwd') || '.'
    const { matrix, hasResults } = await createMatrixForAffectedModules(
      'gradlew',
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
