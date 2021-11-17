// Node.js core
// External
import {
  addPath,
  debug,
  error as _error,
  exportVariable,
  getInput,
} from '@actions/core'
import { cp, mkdirP, mv } from '@actions/io'
import { downloadTool, extractZip } from '@actions/tool-cache'
import { getRelease, Release } from '@hashicorp/js-releases'
import { promises as fs } from 'fs'
import { platform as _platform } from 'os'
import { dirname, resolve, sep } from 'path'
import { getPlatformAndArch } from '../utils/platform'

async function downloadCLI(url: string): Promise<string> {
  debug(`Downloading Terraform CLI from ${url}`)
  const pathToCLIZip = await downloadTool(url)

  debug('Extracting Terraform CLI zip file')
  const pathToCLI = await extractZip(pathToCLIZip)
  debug(`Terraform CLI path is ${pathToCLI}.`)

  if (!pathToCLIZip || !pathToCLI) {
    throw new Error(`Unable to download Terraform from ${url}`)
  }

  return pathToCLI
}

async function installWrapper(pathToCLI: string): Promise<void> {
  let source
  let target

  // If we're on Windows, then the executable ends with .exe
  const exeSuffix = _platform().startsWith('win') ? '.exe' : ''

  // Rename terraform(.exe) to terraform-bin(.exe)
  try {
    source = [pathToCLI, `terraform${exeSuffix}`].join(sep)
    target = [pathToCLI, `terraform-bin${exeSuffix}`].join(sep)
    debug(`Moving ${source} to ${target}.`)
    await mv(source, target)
  } catch (e) {
    _error(`Unable to move ${source} to ${target}.`)
    throw e
  }

  // Install our wrapper as terraform
  try {
    source = resolve([__dirname, '..', 'wrapper', 'dist', 'index.js'].join(sep))
    target = [pathToCLI, 'terraform'].join(sep)
    debug(`Copying ${source} to ${target}.`)
    await cp(source, target)
  } catch (e) {
    _error(`Unable to copy ${source} to ${target}.`)
    throw e
  }

  // Export a new environment variable, so our wrapper can locate the binary
  exportVariable('TERRAFORM_CLI_PATH', pathToCLI)
}

// Add credentials to CLI Configuration File
// https://www.terraform.io/docs/commands/cli-config.html
async function addCredentials(
  credentialsHostname: string,
  credentialsToken: string,
  osPlat: string
): Promise<void> {
  // format HCL block
  // eslint-disable
  const creds = `
credentials "${credentialsHostname}" {
  token = "${credentialsToken}"
}`.trim()
  // eslint-enable

  // default to OS-specific path
  let credsFile =
    osPlat === 'win32'
      ? `${process.env.APPDATA}/terraform.rc`
      : `${process.env.HOME}/.terraformrc`

  // override with TF_CLI_CONFIG_FILE environment variable
  credsFile = process.env.TF_CLI_CONFIG_FILE
    ? process.env.TF_CLI_CONFIG_FILE
    : credsFile

  // get containing folder
  const credsFolder = dirname(credsFile)

  debug(`Creating ${credsFolder}`)
  await mkdirP(credsFolder)

  debug(`Adding credentials to ${credsFile}`)
  await fs.writeFile(credsFile, creds)
}

async function run(version: string): Promise<Release> {
  try {
    // Gather GitHub Actions inputs
    // const version = core.getInput('terraform_version')
    const credentialsHostname = getInput('cli_config_credentials_hostname')
    const credentialsToken = getInput('cli_config_credentials_token')
    const wrapper = getInput('terraform_wrapper') === 'true'

    // Gather OS details
    const osPlatform = _platform()

    debug(`Finding releases for Terraform version ${version}`)
    const release = await getRelease(
      'terraform',
      version,
      'GitHub Action: Setup Terraform'
    )
    const { platform, arch } = getPlatformAndArch()
    debug(
      `Getting build for Terraform version ${release.version}: ${platform} ${arch}`
    )
    const build = release.getBuild(platform, arch)
    if (!build) {
      throw new Error(
        `Terraform version ${version} not available for ${platform} and ${arch}`
      )
    }

    // Download requested version
    const pathToCLI = await downloadCLI(build.url)

    // Install our wrapper
    if (wrapper) {
      await installWrapper(pathToCLI)
    }

    // Add to path
    addPath(pathToCLI)

    // Add credentials to file if they are provided
    if (credentialsHostname && credentialsToken) {
      await addCredentials(credentialsHostname, credentialsToken, osPlatform)
    }
    return release
  } catch (error) {
    _error(error as Error)
    throw error
  }
}

export default run
