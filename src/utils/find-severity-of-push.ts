import { listCommitMessagesInPush } from './github'
import { Severity } from './semver'
export async function findSeverityOfPush(): Promise<Severity> {
  const commitMsgs = await listCommitMessagesInPush()
  let severity: Severity = null
  if (commitMsgs.some((msg) => msg.includes('#major'))) {
    severity = 'major'
  } else if (commitMsgs.some((msg) => msg.includes('#minor'))) {
    severity = 'minor'
  } else if (commitMsgs.some((msg) => msg.includes('#patch'))) {
    severity = 'patch'
  }
  return severity
}