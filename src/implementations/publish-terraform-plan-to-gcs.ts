import * as core from '@actions/core'
import { exec } from '@actions/exec'
import { existsSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { getTerraformDir, readPaths } from '~/utils/path'
import {
  getExecOptions,
  getGitSha,
  getVarFileArg,
  initTerraformAndDependencies,
} from '~/utils/terragrunt'
import uploadReleaseAsset from '~/vendor/upload-release-asset'

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
  const execOptions = getExecOptions(terraformDir, environment)
  const gitSha = await getGitSha(execOptions, terraformDir)
  const command = await initTerraformAndDependencies(
    terraformDir,
    environment,
    execOptions
  )
  const { planFilename, planFilepath, storagePath } = readPaths(
    environment,
    gitSha,
    storagePrefix,
    storageBucket,
    terraformDir
  )

  if (terraformVars) {
    core.info('Save Terraform variables')
    writeFileSync(resolve(terraformDir, 'extra.auto.tfvars'), terraformVars)
  }

  core.info('Terraform plan')
  const varFileArg = getVarFileArg({ environment, terraformDir })
  await exec(
    `/bin/bash -c "${command} plan -no-color -input=false -out=${planFilepath} ${varFileArg}"`,
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
  await exec(
    'gcloud',
    ['alpha', 'storage', 'cp', `${planFilepath}*`, projectFolder],
    execOptions
  )

  if (terraformVars) {
    core.info('Upload Terraform variables')
    await exec(
      'gcloud',
      [
        'alpha',
        'storage',
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
      'gcloud',
      [
        'alpha',
        'storage',
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
