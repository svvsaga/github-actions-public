import * as core from '@actions/core'
import { readProjectConfig } from '~/implementations/read-project-config'

async function run(): Promise<void> {
  try {
    const cwd = core.getInput('cwd')
    const configFile = core.getInput('config_file')
    const required = core.getBooleanInput('required')

    const config = await readProjectConfig({
      cwd,
      configFile,
      required,
    })

    core.setOutput(
      'project_ids_by_environment',
      JSON.stringify(config.project_ids)
    )
    core.setOutput(
      'project_numbers_by_environment',
      JSON.stringify(config.project_numbers)
    )
    core.setOutput('environments', JSON.stringify(config.environments))
    core.setOutput(
      'matrix',
      JSON.stringify({
        include: config.environments.map((environment) => ({
          environment,
          project_id: config.project_ids[environment],
          project_number: config.project_numbers[environment],
        })),
      })
    )
    core.setOutput('has_matrix', config.environments.length > 0)
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
