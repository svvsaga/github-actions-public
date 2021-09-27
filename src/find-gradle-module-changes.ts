import * as core from '@actions/core'
import { createMatrixForAffectedModules } from './utils'

async function run(): Promise<void> {
  try {
    const { matrix, hasResults } = await createMatrixForAffectedModules(
      'gradlew'
    )

    core.setOutput('matrix', JSON.stringify(matrix))
    core.setOutput('has_results', hasResults)
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
