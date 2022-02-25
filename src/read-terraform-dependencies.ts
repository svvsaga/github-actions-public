import * as core from '@actions/core'
import { readTerraformDependencies } from './implementations/read-terraform-dependencies'

async function run(): Promise<void> {
  try {
    const terraformRoot = core.getInput('cwd')

    const { tfVersion, tgDependencies, tgVersion } =
      await readTerraformDependencies({
        terraformRoot,
      })

    core.setOutput('tf_version', tfVersion)
    core.setOutput('tg_version', tgVersion)
    core.setOutput('tg_dependencies', tgDependencies)
  } catch (error: any) {
    core.setFailed(error)
  }
}

void run()
