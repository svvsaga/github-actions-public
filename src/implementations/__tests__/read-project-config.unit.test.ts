import { readProjectConfig } from '../read-project-config'

describe('readProjectConfig', () => {
  const testDir = new URL('read-project-config', import.meta.url).pathname

  it('should return empty string if no config file found', async () => {
    const result = await readProjectConfig({ cwd: '.' })
    expect(result).toBe('')
  })

  it('should return empty string if config file is empty', async () => {
    const result = await readProjectConfig({
      cwd: testDir,
      configFile: 'projects.config.empty.json',
    })
    expect(result).toBe('')
  })

  it('should return values from test config file', async () => {
    const result = await readProjectConfig({
      cwd: testDir,
    })
    expect(JSON.parse(result)).toEqual({
      STM: 'my-project-stm-123',
      ATM: 'my-project-atm-456',
      PROD: 'my-project-prod-789',
    })
  })

  it('should find up from current dir to find closest config file', async () => {
    const result = await readProjectConfig({
      cwd: `${testDir}/inner-project/inner-inner-project`,
    })
    expect(JSON.parse(result)).toEqual({
      STM: 'my-project-stm-abc',
      ATM: 'my-project-atm-def',
      PROD: 'my-project-prod-ghi',
    })
  })

  it('should find in config file in current dir', async () => {
    const result = await readProjectConfig({
      cwd: `${testDir}/inner-project`,
    })
    expect(JSON.parse(result)).toEqual({
      STM: 'my-project-stm-abc',
      ATM: 'my-project-atm-def',
      PROD: 'my-project-prod-ghi',
    })
  })
})
