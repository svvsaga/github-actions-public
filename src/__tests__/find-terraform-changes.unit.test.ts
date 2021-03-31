import { resolve } from 'path'
import {
  findAffectedModules,
  findModules,
} from '~/find-terraform-changes-implementation'

describe('find-terraform-changes', () => {
  describe('findModules', () => {
    it('finds all modules in repo', async () => {
      const expectedModules = ['./', './.husky'].map((m) => resolve(m))

      expect(await findModules('.gitignore')).toEqual(expectedModules)
    })
  })

  describe('findAffectedModules', () => {
    it('finds all and only affected modules', () => {
      const moduleDirs = ['.', './system/alpha', './system/beta'].map((dir) =>
        resolve(dir)
      )

      expect(
        findAffectedModules({
          moduleDirs,
          filesInPr: ['system/charlie/main.tf'],
        })
      ).toEqual([resolve('.')])
      expect(
        findAffectedModules({
          moduleDirs,
          filesInPr: ['system/alpha/main.tf'],
        })
      ).toEqual([resolve('system/alpha')])
    })
  })
})
