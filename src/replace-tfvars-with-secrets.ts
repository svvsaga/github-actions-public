import * as core from '@actions/core'
import replaceTfvarsWithSecrets from './implementations/replace-tfvars-with-secrets'

async function run(): Promise<void> {
  try {
    const secrets = JSON.parse(core.getInput('secrets_json') || '{}') as Record<
      string,
      string
    >
    const terraformDir = core.getInput('terraform_dir')
    const secretsFile = core.getInput('secrets_file')
    await replaceTfvarsWithSecrets({ secrets, terraformDir, secretsFile })
  } catch (error) {
    core.setFailed(error as Error)
  }
}

void run()
