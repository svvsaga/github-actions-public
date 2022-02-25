import * as core from '@actions/core'
import * as fs from 'fs'
import mapValues from 'lodash/mapValues'

type ActionConfig = {
  serviceAccountSecret?: string
  workloadIdentityProjectId?: string
  workloadIdentityProjectNumber?: string
  environment?: string
  tfVarToSecretMap?: Record<string, string>
}

export type TerraformPRConfig = {
  saSecret?: string
  saSecretKey?: string
  environment: string
  tfVars: Record<string, string>
  workloadIdentityProjectId?: string
  workloadIdentityProjectNumber?: string
}

export async function readTfPrActionConfig({
  terraformRoot,
  secrets,
}: {
  terraformRoot: string
  secrets: Record<string, string>
}): Promise<TerraformPRConfig> {
  let workloadIdentityProjectId: string | undefined = undefined
  let workloadIdentityProjectNumber: string | undefined = undefined
  let saSecret: string | undefined = undefined
  let saSecretKey: string | undefined = undefined
  let environment = 'SHARED'
  let tfVars: Record<string, string> = {}

  const configPath = `${terraformRoot}/tf-pr-action.config.json`
  if (fs.existsSync(configPath)) {
    const file = fs.readFileSync(configPath, 'utf-8')
    const config = JSON.parse(file) as ActionConfig
    if (config.workloadIdentityProjectId) {
      workloadIdentityProjectId = config.workloadIdentityProjectId
    }
    if (config.workloadIdentityProjectNumber) {
      workloadIdentityProjectNumber = config.workloadIdentityProjectNumber
    }
    if (config.serviceAccountSecret) {
      saSecret = config.serviceAccountSecret
      saSecretKey = secrets[config.serviceAccountSecret]
    }
    if (config.environment) {
      environment = config.environment
    }
    if (config.tfVarToSecretMap) {
      const transformedMap = mapValues(
        config.tfVarToSecretMap,
        (secret) => secrets[secret]
      )
      tfVars = transformedMap
    }
  } else {
    core.info(
      'No ts-pr-action.config.json found. If this module needs to run as a specific SA, add a ts-pr-action.config.json.'
    )
  }
  return {
    saSecret,
    saSecretKey,
    environment,
    tfVars,
    workloadIdentityProjectId,
    workloadIdentityProjectNumber,
  }
}
