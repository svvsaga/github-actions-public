import * as core from '@actions/core'
import { findTerraformChanges } from './implementations/find-terraform-changes'

async function run(): Promise<void> {
  try {
    await findTerraformChanges()
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
