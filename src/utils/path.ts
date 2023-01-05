import { findUp } from 'find-up'
import { readFileSync } from 'fs'
import orderBy from 'lodash-es/orderBy'
import { resolve } from 'path'

export async function readFileUp(
  cwd: string,
  fileName: string
): Promise<string> {
  const path = await findUp(fileName, { cwd })
  if (!path) throw new Error(`Could not find ${fileName} in folder or parents`)
  return readFileSync(path, 'utf-8').trim()
}

export function relativizePath(path: string, prefix = '.'): string {
  return path.startsWith(prefix) ? path : `${prefix}/${path}`
}

export function findClosest(path: string, prefixes: string[]): string | null {
  const orderedPrefixes = orderBy(prefixes, (p) => p.length, 'desc').map(
    (dir) => relativizePath(dir)
  )
  const relativePath = relativizePath(path)
  for (const prefix of orderedPrefixes) {
    if (relativePath.startsWith(prefix)) return prefix
  }
  return null
}

export function getTerraformDir(projectRoot: string): string {
  const workspace = process.env.GITHUB_WORKSPACE

  if (!workspace) {
    throw new Error('GITHUB_WORKSPACE not set!')
  }

  return resolve(workspace, projectRoot, 'terraform')
}

export function readPaths(
  environment: string,
  gitSha: string,
  storagePrefix: string | undefined,
  storageBucket: string,
  terraformDir: string
): { planFilename: string; planFilepath: string; storagePath: string } {
  const planFilename = `plan_${environment}_${gitSha}.plan`
  const planFilepath = resolve(terraformDir, planFilename)
  const storagePath = storagePrefix
    ? `${storageBucket}/${storagePrefix}`
    : storageBucket
  return { planFilename, planFilepath, storagePath }
}
