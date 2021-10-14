import * as core from '@actions/core'
import * as fs from 'fs'
import mapValues from 'lodash/mapValues'
import { readFileUp } from './utils/path'

type ActionConfig = {
  serviceAccountSecret: string
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

async function run(): Promise<void> {
  try {
    const terraformRoot = core.getInput('cwd')

    const tfVersion = await readFileUp(terraformRoot, '.terraform-version')
    core.setOutput('tf_version', tfVersion)

    const tgVersion = await readFileUp(terraformRoot, '.terragrunt-version')
    core.setOutput('tg_version', tgVersion)

    const secrets = JSON.parse(core.getInput('secrets_json') || '{}') as Record<
      string,
      string
    >

    if (fs.existsSync(`${terraformRoot}/terragrunt.hcl`)) {
      const terragruntConfig = fs.readFileSync(
        `${terraformRoot}/terragrunt.hcl`,
        'utf8'
      )
      const dependencies = readTerragruntDependencies(terragruntConfig)
      core.setOutput('tg_dependencies', dependencies)
    } else {
      core.setOutput('tg_dependencies', [])
    }
    const configPath = `${terraformRoot}/tf-pr-action.config.json`
    if (fs.existsSync(configPath)) {
      const file = fs.readFileSync(configPath, 'utf-8')
      const config = JSON.parse(file) as ActionConfig
      core.setOutput('sa_secret', config.serviceAccountSecret)
      core.setOutput('sa_secret_key', secrets[config.serviceAccountSecret])
      core.info('sa_secret set')
      if (config.environment) {
        core.setOutput('environment', config.environment)
        core.info('environment set')
      }
      if (config.tfVarToSecretMap) {
        const transformedMap = mapValues(
          config.tfVarToSecretMap,
          (secret) => secrets[secret]
        )
        core.info(`transformed map: ${JSON.stringify(transformedMap)}`)

        core.setOutput('tf_vars', JSON.stringify(transformedMap))
      }
    } else {
      core.warning('no ts-pr-action.config.json found, aborting...')
    }
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
