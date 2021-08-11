import * as core from '@actions/core'
import * as github from '@actions/github'
import { PullRequestEvent } from '@octokit/webhooks-definitions/schema'
import fetch from 'node-fetch'

export function getPrefixAndCardId(
  body: string,
  cardIdRegex: string
): { prefix: string; taskid: string }[] | undefined {
  const regex = new RegExp(cardIdRegex, 'g')
  const matches = body.match(regex)
  if (matches) {
    return matches
      .map((match) => match.split('-'))
      .map((match) => ({
        prefix: match[0],
        taskid: match[1],
      }))
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

export function findNextPr(card: Card, html_url: string): number | undefined {
  const filtered = card.customfields.filter((field) =>
    field.name.startsWith('Relatert PR')
  )

  // Don't do anything if PR allready on card
  if (filtered.some((field) => field.value === html_url)) {
    return undefined
  }

  const firstIndex = filtered.findIndex((field) => field.value === null)
  return firstIndex < 0 ? filtered.length : firstIndex
}

async function getPrNumber({
  boardid,
  taskid,
  url,
  apikey,
  html_url,
}: {
  boardid: string
  taskid: string
  url: string
  apikey: string
  html_url: string
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

  return findNextPr(json, html_url)
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
}): Promise<void | undefined> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey,
      Accept: 'json',
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

  if (!response.ok) {
    return undefined
  }

  return await response.json()
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
  console.log(html_url, body, subdomain, cardIdRegex)

  const ids = getPrefixAndCardId(body, cardIdRegex)
  console.log(`ids ${ids}`)
  if (!ids) {
    return
  }

  for (const id of ids) {
    const { prefix, taskid } = id
    const boardid = boardIdByPrefix.get(prefix)
    console.log(`boardid ${boardid}`)
    if (!boardid) {
      continue
    }

    const getCardDetailsURL = `https://${subdomain}.kanbanize.com/index.php/api/kanbanize/get_task_details/`
    const prNumber = await getPrNumber({
      boardid,
      taskid,
      url: getCardDetailsURL,
      apikey,
      html_url,
    })
    console.log(`prNumber ${prNumber}`)
    if (!prNumber) {
      continue
    }

    const editCustomFieldURL = `https://${subdomain}.kanbanize.com/index.php/api/kanbanize/edit_custom_fields/`
    const editResponse = await editCustomField({
      taskid,
      prNumber,
      html_url,
      url: editCustomFieldURL,
      apikey,
    })
    console.log(`editResponse ${editResponse}`)
    if (!editResponse) {
      continue
    }

    console.log(`Added PR to card ${taskid}`)
  }
}
