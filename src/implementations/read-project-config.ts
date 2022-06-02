import { findUp } from 'find-up'
import { readFileSync } from 'fs'

export async function readProjectConfig({
  cwd,
  configFile = 'projects.config.json',
}: {
  cwd: string
  configFile?: string
}): Promise<string> {
  const configPath = await findUp(configFile, { cwd })

  if (configPath) {
    return readFileSync(configPath, 'utf-8')
  } else {
    return ''
  }
}
