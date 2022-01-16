import * as core from '@actions/core'
import * as fs from 'fs'
import mapValues from 'lodash/mapValues'
import { readFileUp } from './utils/path'

type ActionConfig = {
  serviceAccountSecret?: string
  workloadIdentityProjectId?: string
  workloadIdentityProjectNumber?: string
  environment?: string
  tfVarToSecretMap?: Record<string, string>
}

export function readTerragruntDependencies(terragruntConfig: string): string[] {
  return terragruntConfig
    .split('\n')
    .map((line) => line.match(/^\s*config_path\s+?=\s+?"(.+?)"/))
    .filter((x): x is RegExpMatchArray => Boolean(x))
    .map(([, path]) => path)
}

export type ReadTerraformConfigOptions = {
  terraformRoot: string
  secrets: Record<string, string>
}

export type TerraformConfig = {
  tfVersion: string
  tgVersion: string
  tgDependencies: string[]
  saSecret?: string
  saSecretKey?: string
  environment: string
  tfVars: Record<string, string>
  workloadIdentityProjectId?: string
  workloadIdentityProjectNumber?: string
  isTerragruntModule: boolean
}

export async function readTerraformConfig({
  terraformRoot,
  secrets,
}: ReadTerraformConfigOptions): Promise<TerraformConfig> {
  const tfVersion = await readFileUp(terraformRoot, '.terraform-version')
  const tgVersion = await readFileUp(terraformRoot, '.terragrunt-version')

  let tgDependencies: string[] = []
  let workloadIdentityProjectId: string | undefined = undefined
  let workloadIdentityProjectNumber: string | undefined = undefined
  let saSecret: string | undefined = undefined
  let saSecretKey: string | undefined = undefined
  let environment = 'SHARED'
  let tfVars: Record<string, string> = {}
  let isTerragruntModule = false

  if (fs.existsSync(`${terraformRoot}/terragrunt.hcl`)) {
    isTerragruntModule = true
    const terragruntConfig = fs.readFileSync(
      `${terraformRoot}/terragrunt.hcl`,
      'utf8'
    )
    tgDependencies = readTerragruntDependencies(terragruntConfig)
  }
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
    tfVersion,
    tgVersion,
    tgDependencies,
    saSecret,
    saSecretKey,
    environment,
    tfVars,
    workloadIdentityProjectId,
    workloadIdentityProjectNumber,
    isTerragruntModule,
  }
}

async function run(): Promise<void> {
  try {
    const terraformRoot = core.getInput('cwd')

    const secrets = JSON.parse(core.getInput('secrets_json') || '{}') as Record<
      string,
      string
    >

    const {
      tfVars,
      tfVersion,
      tgDependencies,
      tgVersion,
      environment,
      saSecret,
      saSecretKey,
      workloadIdentityProjectId,
      workloadIdentityProjectNumber,
    } = await readTerraformConfig({
      terraformRoot,
      secrets,
    })

    core.setOutput('tf_version', tfVersion)
    core.setOutput('tg_version', tgVersion)
    if (Object.keys(tfVars).length > 0) {
      core.setOutput('tf_vars', JSON.stringify(tfVars))
    }
    core.setOutput('tg_dependencies', tgDependencies)
    if (environment) {
      core.setOutput('environment', environment)
    }
    if (saSecret) {
      core.setOutput('sa_secret', saSecret)
    }
    if (saSecretKey) {
      core.setOutput('sa_secret_key', saSecretKey)
    }
    if (workloadIdentityProjectId) {
      core.setOutput('workload_identity_project_id', workloadIdentityProjectId)
    }
    if (workloadIdentityProjectNumber) {
      core.setOutput(
        'workload_identity_project_number',
        workloadIdentityProjectNumber
      )
    }
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
