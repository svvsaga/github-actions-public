import * as core from '@actions/core'
import * as toolCache from '@actions/tool-cache'
import { chmodSync } from 'fs'
import * as nodeOs from 'os'

// arch in [arm, x32, x64...] (https://nodejs.org/api/os.html#os_os_arch)
// return value in [amd64, 386, arm]
function mapArch(arch: string): string {
  const mappings: Record<string, string> = {
    x32: '386',
    x64: 'amd64',
  }
  return mappings[arch] || arch
}

// os in [darwin, linux, win32...] (https://nodejs.org/api/os.html#os_os_platform)
// return value in [darwin, linux, windows]
function mapOS(os: string): string {
  const mappings: Record<string, string> = {
    win32: 'windows',
  }
  return mappings[os] || os
}

const getDownloadUrl = ({
  version,
  os,
  arch,
}: {
  version: string
  os: string
  arch: string
}): string =>
  `https://storage.googleapis.com/svv-saga-shared-nvck/bin/tfmask-${os}-${arch}-${version}${
    os === 'windows' ? '.exe' : ''
  }`

async function getCachedTfMaskPath({
  version,
  os,
  arch,
}: {
  version: string
  os: string
  arch: string
}): Promise<string> {
  let cachedPath = toolCache.find('tfmask', version, arch)
  if (cachedPath) {
    core.info(`tfmask found at ${cachedPath}`)
  } else {
    const downloadUrl = getDownloadUrl({ version, arch, os })
    core.info(`tfmask not found, downloading from ${downloadUrl}...`)
    const downloadPath = await toolCache.downloadTool(downloadUrl)

    cachedPath = await toolCache.cacheFile(
      downloadPath,
      'tfmask',
      'tfmask',
      version,
      arch
    )
    chmodSync(`${cachedPath}/tfmask`, '755')

    core.info(`tfmask cached at ${cachedPath}`)
  }

  return cachedPath
}

export default async function run(version = '0.7.0'): Promise<string> {
  const osPlatform = nodeOs.platform()
  const osArch = nodeOs.arch()
  const os = mapOS(osPlatform)
  const arch = mapArch(osArch)
  const toolPath: string = await getCachedTfMaskPath({
    version,
    os,
    arch,
  })
  core.addPath(toolPath)
  core.info(`${toolPath} added to path`)
  return toolPath
}
