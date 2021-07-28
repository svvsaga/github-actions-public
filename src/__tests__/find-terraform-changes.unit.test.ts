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
      expect(await findModules('.gitignore', { ignoreModules: ['.'] })).toEqual(
        ['./.husky']
      )
    })

    it('ignores ignored modules by regex', async () => {
      expect(
        await findModules('.gitignore', { ignoreModulesRegex: /husky/ })
      ).toEqual(['.'])
    })
  })

  describe('findAffectedModules', () => {
    it('finds all and only affected modules', () => {
      const moduleDirs = ['.', './system/alpha', './system/beta']

      expect(
        findAffectedModules({
          moduleDirs,
          affectedFiles: ['system/charlie/main.tf'],
        })
      ).toEqual(['.'])
      expect(
        findAffectedModules({
          moduleDirs,
          affectedFiles: ['system/alpha/main.tf'],
        })
      ).toEqual(['./system/alpha'])
    })
  })
})
