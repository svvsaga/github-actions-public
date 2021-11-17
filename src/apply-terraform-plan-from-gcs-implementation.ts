import * as core from '@actions/core'
import { exec } from '@actions/exec'
import * as github from '@actions/github'
import { existsSync, readFileSync } from 'fs'
import last from 'lodash/last'
import { resolve } from 'path'
import { getTerraformDir, readFileUp } from './utils/path'
import setupTerraform from './vendor/setup-terraform'
import setupTerragrunt from './vendor/setup-terragrunt'

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

  let rootSha: string | null = null
  await exec('git', ['log', '--format=%h', '-1'], {
    ...execOptions,
    listeners: {
      stdout: (buffer) => (rootSha = buffer.toString().trim()),
    },
  })
  if (!rootSha) throw new Error(`failed to get git SHA of root`)

  core.info(`Create deployment for ref ${rootSha}`)
  const octokit = github.getOctokit(githubToken, {
    previews: ['ant-man-preview', 'flash-preview'],
  })

  const { owner, repo } = github.context.repo

  const deploymentResponse = await octokit.rest.repos.createDeployment({
    owner,
    repo,
    ref: rootSha,
    description: `Deploy ${application} ${gitSha} to ${environment}`,
    environment: `${application} ${environment} TF`,
    production_environment: environment === 'PROD',
    auto_merge: false,
    required_contexts: [],
  })

  if (deploymentResponse.status >= 300 || !('id' in deploymentResponse.data)) {
    throw new Error(
      `Failed to create deployment: ${
        deploymentResponse.status
      } - ${JSON.stringify(deploymentResponse.data)}`
    )
  }

  core.info('Set deployment to "In progress"')
  const { id: deployment_id } = deploymentResponse.data
  const createDeploymentStatusResponse =
    await octokit.rest.repos.createDeploymentStatus({
      deployment_id,
      owner,
      repo,
      state: 'in_progress',
    })
  if (createDeploymentStatusResponse.status >= 300) {
    throw new Error(
      `Failed to create deployment status: ${
        createDeploymentStatusResponse.status
      } - ${JSON.stringify(createDeploymentStatusResponse.data)}`
    )
  }

  let success = false

  try {
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

    const planFilename = `plan_${environment}_${gitSha}.plan`
    const planFilepath = resolve(terraformDir, planFilename)
    const storagePath = storagePrefix
      ? `${storageBucket}/${storagePrefix}`
      : storageBucket

    core.info('Download plan data from Google Storage')
    await exec('gsutil', [
      'cp',
      `gs://${storagePath}/terraform-plans/${projectRoot}/${planFilename}*`,
      terraformDir,
    ])

    core.info('Terraform plan')
    await exec(
      `/bin/bash -c "${command} plan -no-color -input=false -out=${planFilepath}.new -var-file=environments/${environment}.tfvars`,
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
    await octokit.rest.repos.createDeploymentStatus({
      deployment_id,
      owner,
      repo,
      state: success ? 'success' : 'failure',
    })
  }
}
