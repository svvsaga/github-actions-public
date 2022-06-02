import * as core from '@actions/core'
import { readProjectConfig } from '~/implementations/read-project-config'

async function run(): Promise<void> {
  try {
    const cwd = core.getInput('cwd')
    const configFile = core.getInput('config_file')

    const json = await readProjectConfig({
      cwd,
      configFile,
    })

    core.setOutput('project_ids_by_environment', json)
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
