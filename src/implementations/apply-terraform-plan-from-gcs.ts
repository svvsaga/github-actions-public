import * as core from '@actions/core'
import { exec } from '@actions/exec'
import { readFileSync } from 'fs'
import last from 'lodash/last'
import { endDeployment, startDeployment } from '~/utils/deployment'
import { getTerraformDir, readPaths } from '~/utils/path'
import {
  getExecOptions,
  getGitSha,
  getVarFileArg,
  initTerraformAndDependencies,
} from '~/utils/terragrunt'

interface DeployTerraformPlanOptions {
  projectRoot: string
  storageBucket: string
  environment: string
  githubToken: string
  application: string
  skipDiff?: boolean
  storagePrefix?: string
}

export async function deployTerraformPlanWithInputs(): Promise<void> {
  const projectRoot = core.getInput('project_root', { required: true })
  const storageBucket = core.getInput('storage_bucket', { required: true })
  const environment = core.getInput('environment', { required: true })
  const application = core.getInput('application', { required: true })
  const githubToken = core.getInput('github_token', { required: true })
  const skipDiff = core.getInput('skip_diff') === 'true'
  const storagePrefix = core.getInput('storage_prefix')

  await deployTerraformPlan({
    application,
    environment,
    githubToken,
    projectRoot,
    storageBucket,
    skipDiff,
    storagePrefix,
  })
}

export function extractOperations(plan: string): string {
  return (
    last(
      plan.split(
        '─────────────────────────────────────────────────────────────────────────────'
      )
    )?.trim() || ''
  )
    .replace(
      `Your configuration already matches the changes detected above. If you'd like
to update the Terraform state to match, create and apply a refresh-only plan:
  terraform apply -refresh-only`,
      ''
    )
    .replace(
      `Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.`,
      ''
    )
    .trim()
}

async function downloadPlanData(
  storagePath: string,
  projectRoot: string,
  planFilename: string,
  terraformDir: string
): Promise<void> {
  core.info('Download plan data from Google Storage')
  await exec('gcloud', [
    'storage',
    'cp',
    `gs://${storagePath}/terraform-plans/${projectRoot}/${planFilename}*`,
    terraformDir,
  ])
}

export async function deployTerraformPlan({
  projectRoot,
  storageBucket,
  environment,
  githubToken,
  application,
  skipDiff,
  storagePrefix,
}: DeployTerraformPlanOptions): Promise<void> {
  const terraformDir = getTerraformDir(projectRoot)
  const execOptions = getExecOptions(terraformDir, environment)
  const gitSha = await getGitSha(execOptions, terraformDir)
  const rootSha = await getGitSha(execOptions)

  const deployment_id = await startDeployment({
    ref: rootSha,
    application,
    environment,
    githubToken,
    environmentSuffix: 'TF',
  })

  let success = false

  try {
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
    await downloadPlanData(storagePath, projectRoot, planFilename, terraformDir)

    core.info('Terraform plan')
    const varFileArg = getVarFileArg({ environment, terraformDir })
    await exec(
      `/bin/bash -c "${command} plan -no-color -input=false -out=${planFilepath}.new ${varFileArg}`,
      undefined,
      execOptions
    )

    if (skipDiff !== true) {
      core.info('Abort if plans differ')
      await exec(
        `/bin/bash -c "${command} show -no-color ${planFilepath}.new > ${planFilepath}.new.txt"`,
        undefined,
        execOptions
      )

      const newTxt = extractOperations(
        readFileSync(`${planFilepath}.new.txt`, 'utf-8')
      )
      const releasedTxt = extractOperations(
        readFileSync(`${planFilepath}.txt`, 'utf-8')
      )

      if (newTxt !== releasedTxt) {
        core.error(
          `Released and current plan differ, cancelling. Please run release again.
  
  Released plan:
  
  ${releasedTxt}
  
  New plan:
  
  ${newTxt}
          `
        )
        throw new Error(
          'Released and current plan differ, cancelling. Please run release again.'
        )
      } else {
        core.info('Released plan matches new plan, applying...')
      }
    } else {
      core.info('Skipping plan diff, applying new plan...')
    }

    await exec(
      `/bin/bash -c "${command} apply -auto-approve -input=false "${planFilepath}.new"`,
      undefined,
      execOptions
    )

    success = true
  } finally {
    await endDeployment({ deployment_id, githubToken, success })
  }
}
