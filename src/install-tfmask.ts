import * as core from '@actions/core'
import installTfmask from './implementations/install-tfmask'

async function run(): Promise<void> {
  try {
    await installTfmask()
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
