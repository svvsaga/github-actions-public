import * as core from '@actions/core'
import { deployTerraformPlanWithInputs } from './apply-terraform-plan-from-gcs-implementation'

async function run(): Promise<void> {
  try {
    await deployTerraformPlanWithInputs()
  } catch (error) {
    core.setFailed(error as Error)
  }
}

void run()
