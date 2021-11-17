import * as core from '@actions/core'
import * as toolCache from '@actions/tool-cache'
import { chmodSync } from 'fs'
import { readFileUp } from '../utils/path'
import { getPlatformAndArch } from '../utils/platform'

async function fetchCachedTerragrunt(version: string): Promise<string> {
  const { platform, arch } = getPlatformAndArch()

  let toolPath = toolCache.find('terragrunt', version, arch)
  if (toolPath) {
    core.info(`terragrunt found at ${toolPath}`)
  } else {
    const url = `https://github.com/gruntwork-io/terragrunt/releases/download/v${version}/terragrunt_${platform}_${arch}`
    core.info(`terragrunt not found, downloading from ${url}...`)
    const downloadPath = await toolCache.downloadTool(url)
    toolPath = await toolCache.cacheFile(
      downloadPath,
      'terragrunt',
      'terragrunt',
      version,
      arch
    )
    chmodSync(`${toolPath}/terragrunt`, 755)
    core.info(`terragrunt cached at ${toolPath}`)
  }
  return toolPath
}

interface SetupTerragruntOptions {
  terraformDir: string
}

async function setupTerragrunt({
  terraformDir,
}: SetupTerragruntOptions): Promise<void> {
  const version = await readFileUp(terraformDir, '.terragrunt-version')
  const toolPath = await fetchCachedTerragrunt(version)
  core.addPath(toolPath)
  core.info(`${toolPath} added to path`)
}

export default setupTerragrunt
