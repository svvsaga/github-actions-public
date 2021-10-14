import * as core from '@actions/core'
import { listCommitMessagesInPush } from './utils'

export async function findSeverityOfPush(): Promise<void> {
  const commitMsgs = await listCommitMessagesInPush()
  let severity = 'patch'
  if (commitMsgs.some((msg) => msg.includes('#major'))) {
    severity = 'major'
  } else if (commitMsgs.some((msg) => msg.includes('#minor'))) {
    severity = 'minor'
  }
  core.setOutput('severity', severity)
}
