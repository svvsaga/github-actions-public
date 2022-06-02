import { findUp } from 'find-up'
import { readFileSync } from 'fs'

import * as core from '@actions/core'

export async function readProjectConfig({
  cwd,
  configFile = 'projects.config.json',
  required = false,
}: {
  cwd: string
  configFile?: string
  required?: boolean
}): Promise<string> {
  const configPath = await findUp(configFile, { cwd })

  if (configPath) {
    core.info(`Found config file at ${configPath}`)
  } else {
    core.info(`Could not find config file ${configFile} in ${cwd}`)
  }

  const config = configPath ? readFileSync(configPath, 'utf8') : ''

  if (required && !config) {
    throw new Error(`Config file ${configFile} not found or empty`)
  }
  return config
}
