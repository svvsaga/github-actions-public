import * as core from '@actions/core'
import { publishTerraformPlanWithInputs } from './publish-terraform-plan-to-gcs-implementation'

async function run(): Promise<void> {
  try {
    await publishTerraformPlanWithInputs()
  } catch (error) {
    core.setFailed(error as Error)
  }
}

void run()
