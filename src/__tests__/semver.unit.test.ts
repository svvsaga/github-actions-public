import { getLatestTag, getNextVersionTag } from '../utils/semver'

describe('getNextVersionTag', () => {
  describe('when given a version tag', () => {
    it('finds next major version', () => {
      expect(getNextVersionTag('major', 'v1.2.3')).toBe('v2.0.0')
    })
    it('finds next minor version', () => {
      expect(getNextVersionTag('minor', 'v1.2.3')).toBe('v1.3.0')
    })
    it('finds next patch version', () => {
      expect(getNextVersionTag('patch', 'v1.2.3')).toBe('v1.2.4')
    })
    it('finds same version if no severity', () => {
      expect(getNextVersionTag(null, 'v1.2.3')).toBe('v1.2.3')
    })
  })
  describe('with no version', () => {
    it('finds next major version', () => {
      expect(getNextVersionTag('major', null)).toBe('v1.0.0')
    })
    it('finds next minor version', () => {
      expect(getNextVersionTag('minor', null)).toBe('v0.1.0')
    })
    it('finds next patch version', () => {
      expect(getNextVersionTag('patch', null)).toBe('v0.0.1')
    })
    it('finds same version if no severity', () => {
      expect(getNextVersionTag(null, null)).toBe('v0.0.0')
    })
  })
})

describe('getLatestTag', () => {
  it('finds truthy semver latest tag', async () => {
    const latestTag = await getLatestTag()

    console.log('latest tag', latestTag)

    expect(latestTag).toMatch(/^v\d+\.\d+\.\d+$/)
  })
})
