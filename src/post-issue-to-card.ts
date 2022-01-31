import * as core from '@actions/core'
import postIssueToCard from './implementations/post-issue-to-card'

async function run(): Promise<void> {
  try {
    await postIssueToCard()
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
