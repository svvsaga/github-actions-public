import { setOutput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { readFileSync, statSync } from 'fs'

interface UploadReleaseAssetOptions {
  releaseId: number
  assetPath: string
  assetName: string
  assetContentType: string
}

async function run({
  releaseId,
  assetContentType,
  assetName,
  assetPath,
}: UploadReleaseAssetOptions): Promise<void> {
  // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage

  const githubToken = process.env.GITHUB_TOKEN
  if (!githubToken) {
    throw new Error('GITHUB_TOKEN is missing!')
  }

  const github = getOctokit(githubToken)

  // Determine content-length for header to upload asset
  const contentLength = (filePath: string): number => statSync(filePath).size

  // Setup headers for API call, see Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset for more information
  const headers = {
    'content-type': assetContentType,
    'content-length': contentLength(assetPath),
  }

  // Upload a release asset
  // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
  // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset
  const uploadAssetResponse = await github.rest.repos.uploadReleaseAsset({
    owner: context.repo.owner,
    repo: context.repo.repo,
    release_id: releaseId,
    data: readFileSync(assetPath, 'utf-8'),
    headers,
    name: assetName,
  })

  // Get the browser_download_url for the uploaded release asset from the response
  const {
    data: { browser_download_url: browserDownloadUrl },
  } = uploadAssetResponse

  // Set the output variable for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
  setOutput('browser_download_url', browserDownloadUrl)
}

export default run
