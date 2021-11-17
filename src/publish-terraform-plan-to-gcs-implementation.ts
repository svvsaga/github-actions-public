import * as core from '@actions/core'
import { exec } from '@actions/exec'
import { existsSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { getTerraformDir, readFileUp } from './utils/path'
import setupTerraform from './vendor/setup-terraform'
import setupTerragrunt from './vendor/setup-terragrunt'
import uploadReleaseAsset from './vendor/upload-release-asset'

interface PublishTerraformPlanOptions {
  projectRoot: string
  storageBucket: string
  environment: string
  releaseId?: number
  terraformVars?: string
  storagePrefix?: string
}

export async function publishTerraformPlanWithInputs(): Promise<void> {
  const projectRoot = core.getInput('project_root', { required: true })
  const storageBucket = core.getInput('storage_bucket', { required: true })
  const environment = core.getInput('environment', { required: true })
  const releaseId = isNaN(Number(core.getInput('release_id')))
    ? undefined
    : Number(core.getInput('release_id'))
  const terraformVars = core.getInput('terraform_vars')
  const storagePrefix = core.getInput('storage_prefix')

  await publishTerraformPlan({
    projectRoot,
    environment,
    terraformVars,
    storageBucket,
    releaseId,
    storagePrefix,
  })
}

export async function publishTerraformPlan({
  projectRoot,
  environment,
  terraformVars,
  storageBucket,
  releaseId,
  storagePrefix,
}: PublishTerraformPlanOptions): Promise<void> {
  const terraformDir = getTerraformDir(projectRoot)

  const execOptions = {
    cwd: terraformDir,
    env: process.env as Record<string, string>,
  }

  execOptions.env.TF_INPUT = 'false'

  let gitSha: string | null = null
  await exec('git', ['log', '--format=%h', '-1', terraformDir], {
    ...execOptions,
    listeners: {
      stdout: (buffer) => (gitSha = buffer.toString().trim()),
    },
  })
  if (!gitSha)
    throw new Error(`failed to get git SHA of folder ${terraformDir}`)
  const planFilename = `plan_${environment}_${gitSha}.plan`
  const planFilepath = resolve(process.env.GITHUB_WORKSPACE || '', planFilename)
  const storagePath = storagePrefix
    ? `${storageBucket}/${storagePrefix}`
    : storageBucket

  core.info('Setup Terraform')
  await setupTerraform(await readFileUp(terraformDir, '.terraform-version'))

  let command = 'terraform'

  if (existsSync(resolve(terraformDir, 'terragrunt.hcl'))) {
    core.info('Setup Terragrunt and alias terraform')
    await setupTerragrunt({ terraformDir })
    command = 'terragrunt'
    // Must init all modules in case of dependencies
    await exec(
      command,
      [
        'run-all',
        'init',
        `-backend-config=environments/${environment}-backend-config.hcl`,
        `-reconfigure`,
      ],
      {
        ...execOptions,
        cwd: process.env.GITHUB_WORKSPACE,
        ignoreReturnCode: true,
      }
    )
  } else {
    core.info('Terraform init')
    await exec(
      command,
      [
        'init',
        `-backend-config=environments/${environment}-backend-config.hcl`,
        `-reconfigure`,
      ],
      execOptions
    )
  }

  core.info('Terraform validate')
  await exec(command, ['validate', '-no-color'], execOptions)

  if (terraformVars) {
    core.info('Save Terraform variables')
    writeFileSync(resolve(terraformDir, 'extra.auto.tfvars'), terraformVars)
  }

  core.info('Terraform plan')
  await exec(
    `/bin/bash -c "${command} plan -no-color -input=false -out=${planFilepath} -var-file=environments/${environment}.tfvars`,
    undefined,
    execOptions
  )

  core.info('Terraform show')
  await exec(
    `/bin/bash -c "${command} show -no-color ${planFilepath} > ${planFilepath}.txt"`,
    undefined,
    execOptions
  )

  const projectFolder = `gs://${storagePath}/terraform-plans/${projectRoot}`

  core.info('Publish plan data to Google Storage')
  await exec('gsutil', ['cp', `${planFilepath}*`, projectFolder], execOptions)

  if (terraformVars) {
    core.info('Upload Terraform variables')
    await exec(
      'gsutil',
      [
        'cp',
        'extra.auto.tfvars',
        `${projectFolder}/${planFilename}.auto.tfvars`,
      ],
      execOptions
    )
  }

  if (existsSync(resolve(terraformDir, 'extra.auto.tfvars.json'))) {
    core.info('Upload Terraform JSON variables')
    await exec(
      'gsutil',
      [
        'cp',
        'extra.auto.tfvars.json',
        `${projectFolder}/${planFilename}.auto.tfvars.json`,
      ],
      execOptions
    )
  }

  if (releaseId) {
    core.info('Upload release asset')
    await uploadReleaseAsset({
      releaseId,
      assetPath: `${planFilepath}.txt`,
      assetName: `tf_plan_${environment}_${gitSha}.txt`,
      assetContentType: 'application/text',
    })
  }
}
