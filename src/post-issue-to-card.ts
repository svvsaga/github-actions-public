import * as core from '@actions/core'
import postIssueToCard from './post-issue-to-card-implementation'

async function run(): Promise<void> {
  try {
    await postIssueToCard()
  } catch (error) {
    core.setFailed(error)
  }
}

void run()
