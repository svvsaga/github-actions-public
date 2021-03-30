import * as core from '@actions/core'
import * as github from '@actions/github'
import { readFileSync } from 'fs'

export async function listFilesInPullRequest(
  includeRemoved = false
): Promise<string[]> {
  const token = core.getInput('token')
  const octokit = github.getOctokit(token)

  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) {
    throw new Error('GITHUB_EVENT_PATH not set')
  }
  const event = JSON.parse(readFileSync(eventPath, 'utf8'))

  const { number: pull_number } = event

  const { repo, owner } = github.context.repo

  const files = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number,
    per_page: 3000,
  })

  if (files.status >= 300) {
    throw new Error(
      `Non-success status code when retrieving PR files: ${files.status}`
    )
  }

  const filteredFiles = includeRemoved
    ? files.data
    : files.data.filter((file) => file.status !== 'removed')

  if (core.isDebug()) {
    core.debug(`${filteredFiles.length} files:`)
    for (const file of filteredFiles) {
      core.debug(file.filename)
    }
  }
  return filteredFiles.map(({ filename }) => filename)
}
