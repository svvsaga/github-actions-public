import * as core from '@actions/core'
import * as github from '@actions/github'
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types'
import {
  PullRequestEvent,
  PushEvent,
  WebhookEvent,
} from '@octokit/webhooks-definitions/schema'
import { readFileSync } from 'fs'

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

  let data: RestEndpointMethodTypes['pulls']['listFiles']['response']['data'] =
    []

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number,
      per_page: 100,
      page: data.length / 100 + 1,
    })

    if (response.status >= 300) {
      throw new Error(
        `Non-success status code when retrieving PR files: ${response.status}`
      )
    }

    data = data.concat(response.data)

    if (response.data.length < 100) {
      break
    }
  }

  const filteredFiles = includeRemoved
    ? data
    : data.filter((file) => file.status !== 'removed')

  if (core.isDebug()) {
    core.debug(`${data.length} files in PR:`)
    for (const file of data) {
      core.debug(`${file.status}: ${file.filename}`)
    }
  }
  return filteredFiles.map(({ filename }) => filename)
}

export async function listFilesInPush(
  includeRemoved = false
): Promise<string[]> {
  const data = await fetchPushData()
  const filteredFiles =
    (includeRemoved
      ? data.files
      : data.files?.filter((file) => file.status !== 'removed')) ?? []

  if (core.isDebug()) {
    core.debug(`${filteredFiles.length} files in push:`)
    for (const file of filteredFiles) {
      core.debug(file.filename)
    }
  }

  return filteredFiles.map(({ filename }) => filename)
}

export async function listCommitMessagesInPush(): Promise<string[]> {
  const data = await fetchPushData()
  const commitMessages = data.commits.map(({ commit }) => commit.message)

  if (core.isDebug()) {
    core.debug(`${commitMessages.length} commit messages in push:`)
    for (const commitMessage of commitMessages) {
      core.debug(commitMessage)
    }
  }

  return commitMessages
}

async function fetchPushData(): Promise<
  RestEndpointMethodTypes['repos']['compareCommits']['response']['data']
> {
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

  return response.data
}

export async function findAffectedFilesInPushOrPr(
  includeRemoved = false
): Promise<string[]> {
  const affectedFiles =
    github.context.eventName === 'pull_request'
      ? await listFilesInPullRequest(includeRemoved)
      : github.context.eventName === 'push'
      ? await listFilesInPush(includeRemoved)
      : null
  if (affectedFiles === null)
    throw new Error(`Unsupported webhook event: ${github.context.eventName}`)
  return affectedFiles
}

export function parseGithubEvent<T extends WebhookEvent>(): T {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) {
    throw new Error('GITHUB_EVENT_PATH not set')
  }

  const event = JSON.parse(readFileSync(eventPath, 'utf8')) as T
  return event
}
