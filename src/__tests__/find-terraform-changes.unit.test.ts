import {
  findAffectedModules,
  findModules,
} from '~/find-terraform-changes-implementation'

describe('find-terraform-changes', () => {
  describe('findModules', () => {
    it('finds all modules in repo', async () => {
      const expectedModules = ['.', './.husky', './.husky/_']

      expect(await findModules('.gitignore')).toEqual(expectedModules)
    })

    it('ignores ignored modules', async () => {
      expect(
        await findModules('.gitignore', { ignoreModules: ['.', './.husky/_'] })
      ).toEqual(['./.husky'])
    })

    it('ignores ignored modules by regex', async () => {
      expect(
        await findModules('.gitignore', { ignoreModulesRegex: /husky/ })
      ).toEqual(['.'])
    })

    it('includes only subfolders of cwd', async () => {
      expect(await findModules('.gitignore', { cwd: '.husky' })).toEqual([
        '.',
        './_',
      ])
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
    it('finds only files in cwd', () => {
      const moduleDirs = ['.', './alpha', './beta']

      expect(
        findAffectedModules({
          moduleDirs,
          affectedFiles: ['system/alpha/main.tf', 'beta/main.tf'],
          cwd: 'system',
        })
      ).toEqual(['./alpha'])
    })
  })
})
