import * as core from '@actions/core'
import * as github from '@actions/github'
import { getOctokit } from '@actions/github'

/**
 * Create a deployment in GitHub and set the deployment status to in_progress
 * @returns ID of the created deployment
 */
export async function startDeployment({
  ref,
  application,
  environment,
  githubToken,
  environmentSuffix,
}: {
  ref: string
  application: string
  environment?: string
  githubToken: string
  environmentSuffix?: string
}): Promise<number> {
  core.info(`Create deployment for ref ${ref}`)
  const octokit = getOctokit(githubToken)

  const { owner, repo } = github.context.repo

  const deploymentResponse = await octokit.rest.repos.createDeployment({
    owner,
    repo,
    ref,
    description: `Deploy ${application} ${ref}${
      environment ? ` to ${environment}` : ''
    }}`,
    environment: `${application}${environment ? ` ${environment}` : ''}${
      environmentSuffix ? ` ${environmentSuffix}` : ''
    }`,
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

  return deployment_id
}

export async function endDeployment({
  deployment_id,
  githubToken,
  success,
}: {
  deployment_id: number
  githubToken: string
  success: boolean
}): Promise<void> {
  const octokit = getOctokit(githubToken)
  const { owner, repo } = github.context.repo
  await octokit.rest.repos.createDeploymentStatus({
    deployment_id,
    owner,
    repo,
    state: success ? 'success' : 'failure',
  })
}
