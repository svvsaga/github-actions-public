import * as core from '@actions/core'
import { findSeverityOfPush } from './find-severity-of-push-implementation'

async function run(): Promise<void> {
  try {
    core.setOutput('severity', await findSeverityOfPush())
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
