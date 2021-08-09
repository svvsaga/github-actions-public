import * as core from '@actions/core'
import * as github from '@actions/github'
import { WebhookPayload } from '@actions/github/lib/interfaces'

function getBoardAndCardId(body: string): string[] {
  const regexp = new RegExp(core.getInput('cardIdRegExp'))
  const matches = body.match(regexp)
  if (matches) {
    return matches[1].split('-')
  }
  return []
}

let teamToBoardIdMap = new Map([['KB', '9']])

async function getPrNumber(
  boardId: string,
  cardId: string,
  url: string
): Promise<string> {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: core.getInput('apikey'),
      Accept: 'json',
    },
    body: JSON.stringify({
      boardId: boardId,
      cardId: cardId,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return ''
      }
      return response.json()
    })
    .then((response) => {
      return response.customfields.length
    })
}

async function editCustomField(
  cardId: string,
  prNumber: string,
  issueURL: string,
  url: string
): Promise<void> {
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: core.getInput('apikey'),
    },
    body: JSON.stringify({
      cardid: cardId,
      fields: [
        {
          name: 'Relatert PR ${prNumber}',
          value: issueURL,
        },
      ],
    }),
  })
}

export default async function run(): Promise<void> {
  if (github.context.eventName === 'pull_request') {
    const prPayload = github.context.payload as WebhookPayload
    const issueNumber = prPayload.number
    const issueUrl = prPayload.html_url
    const body = prPayload.body
    const ids = getBoardAndCardId(body)
    if (ids.length !== 0) {
      return
    }

    const boardId = teamToBoardIdMap.get(ids[0])
    if (boardId === undefined) {
      return
    }

    const cardId = ids[1]
    const editCustomFieldURL =
      'https://norwegianpublicroadsadmin.kanbanize.com/index.php/api/kanbanize/edit_custom_fields/'
    const getCardDetailsURL =
      'https://norwegianpublicroadsadmin.kanbanize.com/index.php/api/kanbanize/get_task_details/'
    const prNumber = await getPrNumber(boardId, cardId, getCardDetailsURL)
    if (prNumber === '') {
      return
    }

    editCustomField(cardId, prNumber, issueUrl, editCustomFieldURL)
  }
}
