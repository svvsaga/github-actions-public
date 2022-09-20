import { ProjectConfig, readProjectConfig } from '../read-project-config'

describe('readProjectConfig', () => {
  const testDir = new URL('read-project-config', import.meta.url).pathname
  const emptyResult: ProjectConfig = {
    project_ids: {},
    project_numbers: {},
    environments: [],
  }

  it('should return empty objects if no config file found and not required', async () => {
    const result = await readProjectConfig({ cwd: '.' })

    expect(result).toEqual(emptyResult)
  })

  it('should fail if no config file found and required', async () => {
    await expect(
      readProjectConfig({ cwd: '.', required: true })
    ).rejects.toThrow()
  })

  it('should return empty objects if config file is empty', async () => {
    const result = await readProjectConfig({
      cwd: testDir,
      configFile: 'projects.config.empty.json',
    })
    expect(result).toEqual(emptyResult)
  })

  it('should return values from test config file', async () => {
    const result = await readProjectConfig({
      cwd: testDir,
    })
    expect(result).toEqual({
      project_ids: {
        STM: 'my-project-stm-123',
        ATM: 'my-project-atm-456',
        PROD: 'my-project-prod-789',
      },
      project_numbers: {
        STM: '123',
        ATM: '456',
        PROD: '789',
      },
      environments: ['STM', 'ATM', 'PROD'],
    })
  })

  it('should find up from current dir to find closest config file', async () => {
    const result = await readProjectConfig({
      cwd: `${testDir}/inner-project/inner-inner-project`,
    })
    expect(result).toEqual({
      project_ids: {
        STM: 'my-project-stm-abc',
        ATM: 'my-project-atm-def',
        PROD: 'my-project-prod-ghi',
      },
      project_numbers: {
        STM: '1233',
        ATM: '4566',
        PROD: '7899',
      },
      environments: ['STM', 'ATM', 'PROD'],
    })
  })

  it('should find in config file in current dir', async () => {
    const result = await readProjectConfig({
      cwd: `${testDir}/inner-project`,
    })
    expect(result).toEqual({
      project_ids: {
        STM: 'my-project-stm-abc',
        ATM: 'my-project-atm-def',
        PROD: 'my-project-prod-ghi',
      },
      project_numbers: {
        STM: '1233',
        ATM: '4566',
        PROD: '7899',
      },
      environments: ['STM', 'ATM', 'PROD'],
    })
  })
})
