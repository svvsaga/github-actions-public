import * as core from '@actions/core'
import { createMatrixForAffectedModules } from './utils'

async function run(): Promise<void> {
  try {
    const includeAll = core.getBooleanInput('include_all')
    const { matrix, hasResults } = await createMatrixForAffectedModules(
      'gradlew',
      { includeAll }
    )

    core.setOutput('matrix', JSON.stringify(matrix))
    core.setOutput('has_results', hasResults)
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
