import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const regex = /\$(\w+)/

export async function replaceTfvarsWithSecrets({
  secrets,
  terraformDir,
  secretsFile,
}: {
  secrets: Record<string, string>
  terraformDir: string
  secretsFile: string
}): Promise<void> {
  const tfvars = readFileSync(resolve(terraformDir, secretsFile), 'utf8')
  const replaced = replaceTfvars(tfvars, secrets)
  writeFileSync(resolve(terraformDir, secretsFile), replaced)
}
export default replaceTfvarsWithSecrets

export function replaceTfvars(
  tfvars: string,
  secrets: Record<string, string>
): string {
  return tfvars
    .split('\n')
    .map((line) => {
      const result = regex.exec(line)
      if (result != null) {
        const [, key] = result
        const value = secrets[key]
        if (value != null) {
          line = line.replace(regex, value)
        }
      }
      return line
    })
    .join('\n')
}
