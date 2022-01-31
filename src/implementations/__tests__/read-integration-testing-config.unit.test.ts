import {
  IntTestingConfig,
  readIntTestingConfig,
} from '~/read-integration-testing-config'

describe('readIntTestingConfig', () => {
  const testDir = new URL('read-integration-testing-config', import.meta.url)
    .pathname
  console.log(testDir)

  it('should return null if no config file found', async () => {
    const result = await readIntTestingConfig('.', 'non-existing-file.json')
    expect(result).toBeNull()
  })

  it('should return default values if config file is empty', async () => {
    const result = await readIntTestingConfig(
      testDir,
      'inttest.config.empty.json'
    )
    expect(result).toEqual({
      environment: 'SHARED',
      workloadIdentityProjectId: undefined,
      workloadIdentityProjectNumber: undefined,
      serviceAccount: 'project-service-account',
    } as IntTestingConfig)
  })

  it('should return values from test config file', async () => {
    const result = await readIntTestingConfig(
      testDir,
      'inttest.config.test.json'
    )
    expect(result).toEqual({
      environment: 'STM',
      workloadIdentityProjectId: 'testproject',
      workloadIdentityProjectNumber: '1234',
      serviceAccount: 'some-service-account',
    } as IntTestingConfig)
  })
})
