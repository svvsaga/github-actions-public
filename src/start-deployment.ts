import * as core from '@actions/core'
import { startDeployment } from './utils/deployment'

async function run(): Promise<void> {
  try {
    const environment = core.getInput('environment')
    const application = core.getInput('application', { required: true })
    const githubToken = core.getInput('github_token', { required: true })
    const ref = core.getInput('ref', { required: true })
    const environmentSuffix = core.getInput('environment_suffix')

    const deploymentId = await startDeployment({
      application,
      environment,
      githubToken,
      ref,
      environmentSuffix,
    })
    core.setOutput('deployment_id', deploymentId)
  } catch (error) {
    core.setFailed(error as Error)
  }
}

void run()
