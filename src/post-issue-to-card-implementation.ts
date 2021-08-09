import * as core from '@actions/core'
import * as github from '@actions/github'
import fetch from 'node-fetch'

function getPrefixAndCardId(
  body: string,
  cardIdRegex: string
): { prefix: string; cardId: string } | undefined {
  const regexp = new RegExp(cardIdRegex)
  const matches = body.match(regexp)
  if (matches) {
    const [prefix, cardId] = matches[0].split('-')
    return { prefix, cardId }
  }
  return undefined
}

const boardIdByPrefix = new Map([['KB', '9']])

export function findNextPr(card: any): number {
  return card.customfields
    .filter((field: any) => field.name.startsWith('Relatert PR'))
    .filter((field: any) => field.value !== null).length
}

async function getPrNumber({
  boardId,
  cardId,
  url,
  apikey,
}: {
  boardId: string
  cardId: string
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
      boardId,
      cardId,
    }),
  })

  if (!response.ok) {
    return undefined
  }
  const json = await response.json()

  return findNextPr(json)
}

async function editCustomField({
  cardId,
  prNumber,
  issueURL,
  url,
  apikey,
}: {
  cardId: string
  prNumber: number
  issueURL: string
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
      cardid: cardId,
      fields: [
        {
          name: `Relatert PR ${prNumber ? prNumber + 1 : ''}`.trim(),
          value: issueURL,
        },
      ],
    }),
  })
}

export default async function run(): Promise<void> {
  if (github.context.eventName === 'pull_request') {
    const prPayload = github.context.payload
    //const issueNumber = prPayload.number
    const issueURL = prPayload.html_url
    const body = prPayload.body
    const ids = getPrefixAndCardId(body, core.getInput('cardIdRegex'))
    if (!ids) {
      return
    }
    const { prefix, cardId } = ids

    const boardId = boardIdByPrefix.get(prefix)
    if (!boardId) {
      return
    }

    const subdomain = core.getInput('kanbanizeSubdomain')
    const getCardDetailsURL = `https://${subdomain}.kanbanize.com/index.php/api/kanbanize/get_task_details/`
    const apikey = core.getInput('apikey')
    const prNumber = await getPrNumber({
      boardId,
      cardId,
      url: getCardDetailsURL,
      apikey,
    })
    if (!prNumber) {
      return
    }

    const editCustomFieldURL = `https://${subdomain}.kanbanize.com/index.php/api/kanbanize/edit_custom_fields/`
    await editCustomField({
      cardId,
      prNumber,
      issueURL,
      url: editCustomFieldURL,
      apikey,
    })
  }
}
