import * as core from '@actions/core'
import { findSeverityOfPush } from './implementations/find-severity-of-push'

async function run(): Promise<void> {
  try {
    core.setOutput('severity', await findSeverityOfPush())
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
