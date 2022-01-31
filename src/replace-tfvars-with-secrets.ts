import * as core from '@actions/core'
import replaceTfvarsWithSecrets from './implementations/replace-tfvars-with-secrets'

async function run(): Promise<void> {
  try {
    await replaceTfvarsWithSecrets()
  } catch (error) {
    core.setFailed(error as Error)
  }
}

void run()
