import * as core from '@actions/core'
import installTfmask from './install-tfmask-implementation'

async function run(): Promise<void> {
  try {
    await installTfmask()
  } catch (error) {
    core.setFailed(error)
  }
}

void run()
