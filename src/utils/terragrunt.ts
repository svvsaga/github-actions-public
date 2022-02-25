import * as core from '@actions/core'
import { exec } from '@actions/exec'
import { existsSync } from 'fs'
import { resolve } from 'path'
import { TerraformConfig } from '~/implementations/read-terraform-dependencies'
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
