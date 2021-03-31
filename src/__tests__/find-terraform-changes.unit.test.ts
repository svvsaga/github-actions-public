import {
  findAffectedModules,
  findModules,
} from '~/find-terraform-changes-implementation'

describe('find-terraform-changes', () => {
  describe('findModules', () => {
    it('finds all modules in repo', async () => {
      const expectedModules = ['.', './.husky']

      expect(await findModules('.gitignore')).toEqual(expectedModules)
    })

    it('ignores ignored modules', async () => {
      expect(await findModules('.gitignore', ['.'])).toEqual(['./.husky'])
    })
  })

  describe('findAffectedModules', () => {
    it('finds all and only affected modules', () => {
      const moduleDirs = ['.', './system/alpha', './system/beta']

      expect(
        findAffectedModules({
          moduleDirs,
          filesInPr: ['system/charlie/main.tf'],
        })
      ).toEqual(['.'])
      expect(
        findAffectedModules({
          moduleDirs,
          filesInPr: ['system/alpha/main.tf'],
        })
      ).toEqual(['./system/alpha'])
    })
  })
})
