import * as core from '@actions/core'
import { exec } from '@actions/exec'
import { findSeverityOfPush } from './find-severity-of-push-implementation'
import { getLatestTag, getNextVersionTag } from './utils/semver'

export async function bumpSemverTag(): Promise<void> {
  const severity = await findSeverityOfPush()

  const latestTag = await getLatestTag()

  if (severity) {
    const nextTag = getNextVersionTag(severity, latestTag)
    core.info(`Tagging ${nextTag}`)
    const exitCode = await exec('git', ['tag', nextTag])
    if (exitCode !== 0) {
      throw new Error(`Failed to tag ${nextTag}`)
    }
    core.setOutput('tag', nextTag)
    core.setOutput('version', nextTag.substring(1))
  } else {
    core.info(`No tags found, or no #patch, #minor or #major commit msgs`)
  }
}
