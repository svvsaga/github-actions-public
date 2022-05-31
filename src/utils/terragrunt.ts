import * as core from '@actions/core'
import { exec } from '@actions/exec'
import { existsSync } from 'fs'
import { resolve } from 'path'
import {
  readTerraformDependencies,
  TerraformConfig,
} from '~/implementations/read-terraform-dependencies'
import setupTerraform from '../vendor/setup-terraform'
import setupTerragrunt from '../vendor/setup-terragrunt'

export async function initTerragruntDependencies(
  terraformRoot: string,
  config: TerraformConfig,
  environment: string
): Promise<void> {
  const execOptions = {
    cwd: terraformRoot,
    env: process.env as Record<string, string>,
  }

  execOptions.env.TF_INPUT = 'false'

  const { tfVersion, tgVersion, tgDependencies, isTerragruntModule } = config

  core.info('Setup Terraform')
  await setupTerraform(tfVersion)

  if (isTerragruntModule) {
    core.info('Setup Terragrunt')
    await setupTerragrunt(tgVersion)

    const args = getInitArgs({ environment, terraformDir: terraformRoot })
    for (const dependency of tgDependencies) {
      const resolved = resolve(terraformRoot, dependency)
      await exec('terragrunt', args, {
        ...execOptions,
        cwd: resolved,
        ignoreReturnCode: true,
      })
    }
  }
}

export function getInitArgs({
  environment,
  terraformDir,
}: {
  environment: string
  terraformDir: string
}): string[] {
  const args = ['init', '-reconfigure']
  const backendConfig = `environments/${environment}-backend-config.hcl`
  const path = resolve(terraformDir, backendConfig)
  if (existsSync(path)) {
    args.push(`-backend-config=${backendConfig}`)
  }
  return args
}

export async function getGitSha(
  execOptions: { cwd: string; env: Record<string, string> },
  terraformDir?: string
): Promise<string> {
  let gitSha: string | null = null
  const args = ['log', '--format=%h', '-1']
  if (terraformDir) {
    args.push(terraformDir)
  }
  await exec('git', args, {
    ...execOptions,
    listeners: {
      stdout: (buffer) => (gitSha = buffer.toString().trim()),
    },
  })
  if (!gitSha)
    throw new Error(`failed to get git SHA of folder ${terraformDir}`)
  return gitSha
}

export function getVarFileArg({
  environment,
  terraformDir,
}: {
  environment: string
  terraformDir: string
}): string {
  const varFile = `environments/${environment}.tfvars`
  const path = resolve(terraformDir, varFile)
  return existsSync(path) ? `-var-file=environments/${environment}.tfvars` : ''
}

export function getExecOptions(
  terraformDir: string,
  environment: string
): { cwd: string; env: Record<string, string> } {
  const execOptions = {
    cwd: terraformDir,
    env: process.env as Record<string, string>,
  }

  execOptions.env.TF_INPUT = 'false'
  execOptions.env.CLOUDSDK_CORE_DISABLE_PROMPTS = '1'
  execOptions.env.TF_VAR_ENV = environment
  return execOptions
}

export async function initTerraformAndDependencies(
  terraformDir: string,
  environment: string,
  execOptions: { cwd: string; env: Record<string, string> }
): Promise<string> {
  const config = await readTerraformDependencies({
    terraformRoot: terraformDir,
  })

  await initTerragruntDependencies(terraformDir, config, environment)

  const command = config.isTerragruntModule ? 'terragrunt' : 'terraform'
  const args = getInitArgs({ environment, terraformDir })

  core.info('Terraform init')
  await exec(command, args, execOptions)

  core.info('Terraform validate')
  await exec(command, ['validate', '-no-color'], execOptions)
  return command
}
