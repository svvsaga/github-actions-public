import {
  findNextPr,
  getPrefixAndCardId,
} from '~/post-issue-to-card-implementation'

describe('post-issue-to-card', () => {
  describe('findNextPr', () => {
    it('find next PR number when field is pressent, but value is null', () => {
      const expectedPrNumber = 0
      const card = JSON.parse(`
      { 
        "taskid": "3061", 
        "boardid": "9", 
        "customfields": [ 
          { 
            "name": "Relatert PR", 
            "value": null 
          } 
        ] 
      }`)

      expect(findNextPr(card, '')).toEqual(expectedPrNumber)
    })

    it('find next PR number when field is pressent and value is not null', () => {
      const expectedPrNumber = 1
      const card = JSON.parse(`
      {
        "taskid": "3061",
        "boardid": "9",
        "customfields": [
          {
            "name": "Relatert PR",
            "value": "test.pr"
          }
        ]
      }
      `)

      expect(findNextPr(card, '')).toEqual(expectedPrNumber)
    })

    it('find next PR number when 2 fields are pressent with values', () => {
      const expectedPrNumber = 2
      const card = JSON.parse(`
      { 
        "taskid": "3061", 
        "boardid": "9", 
        "customfields": [ 
          { 
            "name": "Relatert PR", 
            "value": "test.pr" 
          }, 
          { 
            "name": "Relatert PR 2", 
            "value": "test.pr2" 
          } 
        ] 
      }`)

      expect(findNextPr(card, '')).toEqual(expectedPrNumber)
    })

    it('find next PR number when 2 fields are present, but first value is null', () => {
      const expectedPrNumber = 0
      const card = JSON.parse(`
      { 
        "taskid": "3061", 
        "boardid": "9", 
        "customfields": [ 
          { 
            "name": "Relatert PR", 
            "value": null 
          }, 
          { 
            "name": "Relatert PR 2", 
            "value": "test.pr2" 
          } 
        ] 
      }`)

      expect(findNextPr(card, '')).toEqual(expectedPrNumber)
    })

    it('dont add PR when it already exists on the card', () => {
      const expectedPrNumber = undefined
      const card = JSON.parse(`
      { 
        "taskid": "3061", 
        "boardid": "9", 
        "customfields": [ 
          { 
            "name": "Relatert PR", 
            "value": null 
          }, 
          { 
            "name": "Relatert PR 2", 
            "value": "test.pr2" 
          } 
        ] 
      }`)

      expect(findNextPr(card, 'test.pr2')).toEqual(expectedPrNumber)
    })

    it('find all autolinks', () => {
      const expectedIds = [
        { prefix: 'KB', taskid: '123' },
        { prefix: 'KB', taskid: '4567' },
      ]

      const body = 'KB-123 this is a test KB-4567'
      const regex = 'KB-[0-9]+'
      expect(getPrefixAndCardId(body, regex)).toEqual(expectedIds)
    })
  })
})
