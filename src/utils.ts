import * as core from '@actions/core'
import * as github from '@actions/github'
import {
  PullRequestEvent,
  PushEvent,
  WebhookEvent,
} from '@octokit/webhooks-definitions/schema'
import { readFileSync } from 'fs'

function parseGithubEvent<T extends WebhookEvent>(): T {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) {
    throw new Error('GITHUB_EVENT_PATH not set')
  }

  const event = JSON.parse(readFileSync(eventPath, 'utf8')) as T
  return event
}

export async function listFilesInPullRequest(
  includeRemoved = false
): Promise<string[]> {
  const event = parseGithubEvent<PullRequestEvent>()

  if (!event.number) {
    throw new Error('Webhook is not a `pull_request` event')
  }

  const { number: pull_number } = event

  const token = core.getInput('token')
  const octokit = github.getOctokit(token)
  const { repo, owner } = github.context.repo

  const response = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number,
    per_page: 100,
  })

  if (response.status >= 300) {
    throw new Error(
      `Non-success status code when retrieving PR files: ${response.status}`
    )
  }

  const filteredFiles = includeRemoved
    ? response.data
    : response.data.filter((file) => file.status !== 'removed')

  if (core.isDebug()) {
    core.debug(`${filteredFiles.length} files:`)
    for (const file of filteredFiles) {
      core.debug(file.filename)
    }
  }
  return filteredFiles.map(({ filename }) => filename)
}

export async function listFilesInPush(
  includeRemoved = false
): Promise<string[]> {
  const event = parseGithubEvent<PushEvent>()

  const { before, after } = event

  if (!before || !after) {
    throw new Error('Webhook is not a `push` event')
  }

  const token = core.getInput('token')
  const octokit = github.getOctokit(token)
  const { repo, owner } = github.context.repo

  const response = await octokit.rest.repos.compareCommits({
    repo,
    owner,
    base: before,
    head: after,
    per_page: 100,
  })

  if (response.status >= 300) {
    throw new Error(
      `Non-success status code when retrieving pushed files: ${response.status}`
    )
  }

  const filteredFiles =
    (includeRemoved
      ? response.data.files
      : response.data.files?.filter((file) => file.status !== 'removed')) ?? []

  if (core.isDebug()) {
    core.debug(`${filteredFiles.length} files:`)
    for (const file of filteredFiles) {
      core.debug(file.filename)
    }
  }

  return filteredFiles.map(({ filename }) => filename)
}
