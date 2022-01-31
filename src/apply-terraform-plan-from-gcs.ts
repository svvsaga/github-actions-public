import * as core from '@actions/core'
import { deployTerraformPlanWithInputs } from './implementations/apply-terraform-plan-from-gcs'

async function run(): Promise<void> {
  try {
    await deployTerraformPlanWithInputs()
  } catch (error) {
    core.setFailed(error as Error)
  }
}

void run()
