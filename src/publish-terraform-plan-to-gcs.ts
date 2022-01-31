import * as core from '@actions/core'
import { publishTerraformPlanWithInputs } from './implementations/publish-terraform-plan-to-gcs'

async function run(): Promise<void> {
  try {
    await publishTerraformPlanWithInputs()
  } catch (error) {
    core.setFailed(error as Error)
  }
}

void run()
