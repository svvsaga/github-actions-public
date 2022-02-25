import * as core from '@actions/core'
import { readTfPrActionConfig } from './implementations/read-terraform-pr-config'

async function run(): Promise<void> {
  try {
    const terraformRoot = core.getInput('cwd')

    const secrets = JSON.parse(core.getInput('secrets_json') || '{}') as Record<
      string,
      string
    >

    const {
      tfVars,
      environment,
      workloadIdentityProjectId,
      workloadIdentityProjectNumber,
      saSecret,
      saSecretKey,
    } = await readTfPrActionConfig({
      terraformRoot,
      secrets,
    })

    if (Object.keys(tfVars).length > 0) {
      core.setOutput('tf_vars', JSON.stringify(tfVars))
    }
    if (environment) {
      core.setOutput('environment', environment)
    }
    if (saSecret) {
      core.setOutput('sa_secret', saSecret)
    }
    if (saSecretKey) {
      core.setOutput('sa_secret_key', saSecretKey)
    }
    if (workloadIdentityProjectId) {
      core.setOutput('workload_identity_project_id', workloadIdentityProjectId)
    }
    if (workloadIdentityProjectNumber) {
      core.setOutput(
        'workload_identity_project_number',
        workloadIdentityProjectNumber
      )
    }
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
