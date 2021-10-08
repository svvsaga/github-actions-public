import * as core from '@actions/core'
import * as github from '@actions/github'
import * as glob from '@actions/glob'
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types'
import {
  PullRequestEvent,
  PushEvent,
  WebhookEvent,
} from '@octokit/webhooks-definitions/schema'
import findUp from 'find-up'
import { readFileSync } from 'fs'
import difference from 'lodash-es/difference'
import last from 'lodash-es/last'
import orderBy from 'lodash-es/orderBy'
import uniq from 'lodash-es/uniq'
import { dirname, join, normalize } from 'path'

function parseGithubEvent<T extends WebhookEvent>(): T {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) {
    throw new Error('GITHUB_EVENT_PATH not set')
  }

  const event = JSON.parse(readFileSync(eventPath, 'utf8')) as T
  return event
}

export type PathMatrix = {
  include: {
    path: string
    segments: string[]
    folder: string
  }[]
}

export function createPathMatrix(paths: string[]): PathMatrix {
  return {
    include: paths.map((path) => {
      const segments = path.split('/').filter((x) => !!x)
      return {
        path,
        segments,
        folder: last(segments) || '',
      }
    }),
  }
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
    core.debug(`${filteredFiles.length} files in push:`)
    for (const file of filteredFiles) {
      core.debug(file.filename)
    }
  }

  return filteredFiles.map(({ filename }) => filename)
}

export async function findModules(
  marker: string,
  {
    ignoreModules = [],
    ignoreModulesRegex = undefined,
    cwd = '.',
  }: {
    ignoreModules?: string[]
    ignoreModulesRegex?: RegExp | undefined
    cwd?: string
  } = {}
): Promise<string[]> {
  core.debug(`Module marker: ${marker}`)
  core.debug(`cwd: ${cwd}`)
  const globber = await glob.create(`${cwd}/**/${marker}`)
  const searchPath = globber.getSearchPaths()[0]
  core.debug(`Search path: ${searchPath}`)
  const moduleHits = await globber.glob()
  const moduleDirs = uniq(
    moduleHits
      .map(dirname)
      .filter((dir) => !ignoreModulesRegex || !ignoreModulesRegex.test(dir))
      .map((dir) => dir.replace(searchPath, '.'))
  )
  return difference(moduleDirs, ignoreModules)
}

export function findAffectedModules({
  affectedFiles,
  moduleDirs,
  cwd = '.',
}: {
  affectedFiles: string[]
  moduleDirs: string[]
  cwd?: string
}): string[] {
  const dirsInPr = uniq(affectedFiles.map(dirname)).map(normalize)
  const affectedModules = uniq(
    dirsInPr.map((dir) =>
      findClosest(
        dir,
        moduleDirs.map((moduleDir) => join(cwd, moduleDir))
      )
    )
  ).filter((path) => path != null) as string[]

  return affectedModules.map((module) =>
    module.replace(RegExp(`^${relativizePath(cwd)}`), '.')
  )
}

export function relativizePath(path: string, prefix = '.'): string {
  return path.startsWith(prefix) ? path : `${prefix}/${path}`
}

export function findClosest(path: string, prefixes: string[]): string | null {
  const orderedPrefixes = orderBy(prefixes, (p) => p.length, 'desc').map(
    (dir) => relativizePath(dir)
  )
  const relativePath = relativizePath(path)
  for (const prefix of orderedPrefixes) {
    if (relativePath.startsWith(prefix)) return prefix
  }
  return null
}

export async function createMatrixForAffectedModules(
  marker: string,
  {
    ignoreModules = [],
    ignoreModulesRegex = '',
    cwd = '.',
    includeRemoved = false,
    includeAll = false,
  }: {
    ignoreModules?: string[]
    ignoreModulesRegex?: string
    cwd?: string
    includeRemoved?: boolean
    includeAll?: boolean
  } = {}
): Promise<{ matrix: PathMatrix; hasResults: boolean }> {
  const moduleDirs = await findModules(marker, {
    ignoreModules,
    ignoreModulesRegex: ignoreModulesRegex
      ? RegExp(ignoreModulesRegex)
      : undefined,
    cwd,
  })

  core.debug(`Found ${moduleDirs.length} modules in repo:`)
  for (const module of moduleDirs) {
    core.debug(module)
  }
  if (moduleDirs.length === 0) {
    core.warning(
      'Could not find any modules for the given marker; have you remembered to checkout the code?'
    )
  }

  let affectedModules: string[]

  if (includeAll) {
    affectedModules = moduleDirs
  } else {
    const affectedFiles = await findAffectedFilesInPushOrPr(includeRemoved)

    affectedModules = findAffectedModules({
      affectedFiles,
      moduleDirs,
      cwd,
    })
  }

  core.debug(`Found ${affectedModules.length} affected modules:`)
  for (const module of affectedModules) {
    core.debug(module)
  }

  const matrix = createPathMatrix(affectedModules)
  const hasResults = Boolean(affectedModules.length)
  return { matrix, hasResults }
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
export function getIgnoreModules(): string[] {
  return core
    .getInput('ignore_modules')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => !!s)
}

export async function readFileUp(
  cwd: string,
  fileName: string
): Promise<string> {
  const path = await findUp(fileName, { cwd })
  if (!path) throw new Error(`Could not find ${fileName} in folder or parents`)
  return readFileSync(path, 'utf-8').trim()
}
