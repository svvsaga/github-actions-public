import { findAffectedModules } from '~/find-terraform-changes-implementation'

describe('findAffectedModules', () => {
  it('finds all and only affected modules', () => {
    const moduleDirs = ['/', '/system/alpha', '/system/beta']

    expect(
      findAffectedModules({
        moduleDirs,
        filesInPr: ['/system/charlie/main.tf'],
      })
    ).toEqual(['/'])
    expect(
      findAffectedModules({ moduleDirs, filesInPr: ['/system/alpha/main.tf'] })
    ).toEqual(['/system/alpha'])
  })
})
