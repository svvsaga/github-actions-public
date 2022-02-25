import * as fs from 'fs'
import { readFileUp } from '~/utils/path'

export type TerraformConfig = {
  tfVersion: string
  tgVersion: string
  tgDependencies: string[]
  isTerragruntModule: boolean
}
export async function readTerraformDependencies({
  terraformRoot,
}: {
  terraformRoot: string
}): Promise<TerraformConfig> {
  const tfVersion = await readFileUp(terraformRoot, '.terraform-version')
  const tgVersion = await readFileUp(terraformRoot, '.terragrunt-version')

  let tgDependencies: string[] = []
  let isTerragruntModule = false

  if (fs.existsSync(`${terraformRoot}/terragrunt.hcl`)) {
    isTerragruntModule = true
    const terragruntConfig = fs.readFileSync(
      `${terraformRoot}/terragrunt.hcl`,
      'utf8'
    )
    tgDependencies = readTerragruntDependencies(terragruntConfig)
  }

  return {
    tfVersion,
    tgVersion,
    tgDependencies,
    isTerragruntModule,
  }
}
export function readTerragruntDependencies(terragruntConfig: string): string[] {
  return terragruntConfig
    .split('\n')
    .map((line) => line.match(/^\s*config_path\s+?=\s+?"(.+?)"/))
    .filter((x): x is RegExpMatchArray => Boolean(x))
    .map(([, path]) => path)
}
