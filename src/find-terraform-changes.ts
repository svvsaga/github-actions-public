import * as core from '@actions/core'
import { findTerraformChanges } from './find-terraform-changes-implementation'

async function run() {
  try {
    await findTerraformChanges()
  } catch (error) {
    core.setFailed(error)
  }
}

run()
