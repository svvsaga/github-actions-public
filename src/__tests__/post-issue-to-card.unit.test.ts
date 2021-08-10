import { findNextPr } from '~/post-issue-to-card-implementation'

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

      expect(findNextPr(card)).toEqual(expectedPrNumber)
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

      expect(findNextPr(card)).toEqual(expectedPrNumber)
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

      expect(findNextPr(card)).toEqual(expectedPrNumber)
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

      expect(findNextPr(card)).toEqual(expectedPrNumber)
    })
  })
})
