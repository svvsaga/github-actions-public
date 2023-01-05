import * as core from '@actions/core'
import { endDeployment } from './utils/deployment'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token', { required: true })
    const deployment_id = parseInt(
      core.getInput('deployment_id', { required: true })
    )
    const success = core.getBooleanInput('success', { required: true })

    await endDeployment({
      deployment_id,
      githubToken,
      success,
    })
  } catch (error) {
    core.setFailed(error as Error)
  }
}

void run()
