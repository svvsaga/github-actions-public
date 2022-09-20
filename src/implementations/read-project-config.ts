import { findUp } from 'find-up'
import { readFileSync } from 'fs'

import * as core from '@actions/core'

export type ProjectConfig = {
  project_ids: Record<string, string>
  project_numbers: Record<string, string>
  environments: string[]
}

export async function readProjectConfig({
  cwd,
  configFile = 'projects.config.json',
  required = false,
}: {
  cwd: string
  configFile?: string
  required?: boolean
}): Promise<ProjectConfig> {
  const configPath = await findUp(configFile, { cwd })

  if (configPath) {
    core.info(`Found config file at ${configPath}`)
  } else {
    core.info(`Could not find config file ${configFile} in ${cwd}`)
  }

  const json = configPath ? readFileSync(configPath, 'utf8') : ''

  if (required && !json) {
    throw new Error(`Config file ${configFile} not found or empty`)
  }

  try {
    const { project_numbers, ...project_ids } = JSON.parse(json)
    const environments = Object.keys(project_ids)
    return {
      project_numbers,
      project_ids,
      environments,
    }
  } catch (e: any) {
    core.error(e)
    return {
      project_ids: {},
      project_numbers: {},
      environments: [],
    }
  }
}
