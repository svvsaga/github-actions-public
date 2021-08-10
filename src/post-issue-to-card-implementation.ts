import * as core from '@actions/core'
import * as github from '@actions/github'
import { PullRequestEvent } from '@octokit/webhooks-definitions/schema'
import fetch from 'node-fetch'

function getPrefixAndCardId(
  body: string,
  cardIdRegex: string
): { prefix: string; taskid: string } | undefined {
  const regex = new RegExp(cardIdRegex)
  const matches = body.match(regex)
  if (matches) {
    const [prefix, taskid] = matches[0].split('-')
    return { prefix, taskid }
  }
  return undefined
}

const boardIdByPrefix = new Map([['KB', '9']])

interface Card {
  customfields: CustomField[]
}

interface CustomField {
  name: string
  value: string
}

export function findNextPr(card: Card): number {
  const filtered = card.customfields.filter((field) =>
    field.name.startsWith('Relatert PR')
  )
  const firstIndex = filtered.findIndex((field) => field.value === null)
  return firstIndex < 0 ? filtered.length : firstIndex
}

async function getPrNumber({
  boardid,
  taskid,
  url,
  apikey,
}: {
  boardid: string
  taskid: string
  url: string
  apikey: string
}): Promise<number | undefined> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey,
      Accept: 'json',
    },
    body: JSON.stringify({
      boardid,
      taskid,
    }),
  })

  if (!response.ok) {
    return undefined
  }
  const json = await response.json()

  return findNextPr(json)
}

async function editCustomField({
  taskid,
  prNumber,
  html_url,
  url,
  apikey,
}: {
  taskid: string
  prNumber: number
  html_url: string
  url: string
  apikey: string
}): Promise<void> {
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey,
    },
    body: JSON.stringify({
      cardid: taskid,
      fields: [
        {
          name: `Relatert PR ${prNumber ? prNumber + 1 : ''}`.trim(),
          value: html_url,
        },
      ],
    }),
  })
}

export default async function run(): Promise<void> {
  if (
    github.context.eventName !== 'pull_request' &&
    github.context.payload.pull_request === undefined
  ) {
    return
  }
  const prPayload = github.context.payload as PullRequestEvent
  const html_url = prPayload.pull_request.html_url
  const body = prPayload.pull_request.body
  const subdomain = core.getInput('kanbanizeSubdomain')
  const cardIdRegex = core.getInput('cardIdRegex')
  const apikey = core.getInput('apikey')

  const ids = getPrefixAndCardId(body, cardIdRegex)
  if (!ids) {
    return
  }

  const { prefix, taskid } = ids
  const boardid = boardIdByPrefix.get(prefix)
  if (!boardid) {
    return
  }

  const getCardDetailsURL = `https://${subdomain}.kanbanize.com/index.php/api/kanbanize/get_task_details/`
  const prNumber = await getPrNumber({
    boardid,
    taskid,
    url: getCardDetailsURL,
    apikey,
  })
  if (!prNumber) {
    return
  }

  const editCustomFieldURL = `https://${subdomain}.kanbanize.com/index.php/api/kanbanize/edit_custom_fields/`
  await editCustomField({
    taskid,
    prNumber,
    html_url,
    url: editCustomFieldURL,
    apikey,
  })
}
