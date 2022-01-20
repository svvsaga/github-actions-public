import * as core from '@actions/core'
import * as fs from 'fs'

/**
 * TODO: consider extracting common parts in this and "read-terraform-config.ts"
 */

type ActionConfig = {
  workloadIdentityProjectId?: string
  workloadIdentityProjectNumber?: string
  environment?: string
}

export type IntTestingConfig = {
  environment: string
  workloadIdentityProjectId?: string
  workloadIdentityProjectNumber?: string
}

export async function readIntTestingConfig(
  projectDir: string,
  configFileName: string
): Promise<IntTestingConfig | null> {
  let workloadIdentityProjectId: string | undefined = undefined
  let workloadIdentityProjectNumber: string | undefined = undefined
  let environment = 'SHARED'

  const configPath = `${projectDir}/${configFileName}`
  if (fs.existsSync(configPath)) {
    const file = fs.readFileSync(configPath, 'utf-8')
    const config = JSON.parse(file) as ActionConfig
    if (config.workloadIdentityProjectId) {
      workloadIdentityProjectId = config.workloadIdentityProjectId
    }
    if (config.workloadIdentityProjectNumber) {
      workloadIdentityProjectNumber = config.workloadIdentityProjectNumber
    }
    if (config.environment) {
      environment = config.environment
    }
    return {
      environment,
      workloadIdentityProjectId,
      workloadIdentityProjectNumber,
    }
  } else {
    core.info(`No ${configFileName} found. Unable to run integration tests.`)
    return null
  }
}

async function run(): Promise<void> {
  try {
    const projectRoot = core.getInput('cwd')

    const res = await readIntTestingConfig(projectRoot, 'inttest.config.json')
    if (!res) {
      core.setFailed('No integration testing config file found')
    } else {
      const {
        environment,
        workloadIdentityProjectId,
        workloadIdentityProjectNumber,
      } = res

      if (environment) {
        core.setOutput('environment', environment)
      }

      if (workloadIdentityProjectId) {
        core.setOutput(
          'workload_identity_project_id',
          workloadIdentityProjectId
        )
      }

      if (workloadIdentityProjectNumber) {
        core.setOutput(
          'workload_identity_project_number',
          workloadIdentityProjectNumber
        )
      }
    }
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
