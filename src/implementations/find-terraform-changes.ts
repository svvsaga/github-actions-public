import * as core from '@actions/core'
import { createMatrixForAffectedModules } from '../utils/matrix'
import { getIgnoreModules } from '../utils/modules'

export async function findTerraformChanges(): Promise<void> {
  const marker = core.getInput('marker')
  if (!marker) {
    throw new Error('No module marker specified')
  }
  const ignoreModules = getIgnoreModules()
  const ignoreModulesRegex = core.getInput('ignore_modules_regex')
  const cwd = core.getInput('cwd') || '.'

  const { matrix, hasResults } = await createMatrixForAffectedModules(marker, {
    ignoreModules,
    ignoreModulesRegex,
    cwd,
    includeRemoved: true,
  })

  core.setOutput('matrix', matrix)
  core.setOutput('has_results', hasResults)
}
