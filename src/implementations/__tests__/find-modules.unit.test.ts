import { findAffectedModules, findModules } from '../../utils/modules'

describe('find-terraform-changes', () => {
  describe('findModules', () => {
    const findModuleTestDir = 'src/__tests__/find-modules'
    it('finds all modules in repo', async () => {
      const expectedModules = ['.', './module', './module/submodule']

      expect(
        await findModules('marker.txt', {
          cwd: findModuleTestDir,
        })
      ).toEqual(expectedModules)
    })

    it('ignores ignored modules', async () => {
      expect(
        await findModules('marker.txt', {
          ignoreModules: ['.', './module/submodule'],
          cwd: findModuleTestDir,
        })
      ).toEqual(['./module'])
    })

    it('ignores ignored modules by regex', async () => {
      expect(
        await findModules('marker.txt', {
          ignoreModulesRegex: /\/module/,
          cwd: findModuleTestDir,
        })
      ).toEqual(['.'])
    })

    it('includes only subfolders of cwd', async () => {
      expect(
        await findModules('marker.txt', {
          cwd: 'src/__tests__/find-modules/module',
        })
      ).toEqual(['.', './submodule'])
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
    it('finds files in cwd', () => {
      const moduleDirs = ['./alpha']

      expect(
        findAffectedModules({
          moduleDirs,
          affectedFiles: ['projects/alpha/main.tf'],
          cwd: 'projects',
        })
      ).toEqual(['./alpha'])
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
