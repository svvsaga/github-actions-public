import { listCommitMessagesInPush } from './utils/github'

type Severity = 'major' | 'minor' | 'patch'

export async function findSeverityOfPush(): Promise<Severity> {
  const commitMsgs = await listCommitMessagesInPush()
  let severity: Severity = 'patch'
  if (commitMsgs.some((msg) => msg.includes('#major'))) {
    severity = 'major'
  } else if (commitMsgs.some((msg) => msg.includes('#minor'))) {
    severity = 'minor'
  }
  return severity
}

// Test
