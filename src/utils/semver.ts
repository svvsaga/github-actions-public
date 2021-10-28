import { exec } from '@actions/exec'
import semver from 'semver'

export type Severity = 'major' | 'minor' | 'patch' | null

export function getNextVersionTag(
  severity: Severity,
  version: string | null
): string {
  const parsed = semver.valid(version) ?? '0.0.0'
  switch (severity) {
    case 'major':
      return `v${semver.inc(parsed, 'major')}`
    case 'minor':
      return `v${semver.inc(parsed, 'minor')}`
    case 'patch':
      return `v${semver.inc(parsed, 'patch')}`
  }
  return `v${parsed}`
}

export async function getLatestTag(): Promise<string | null> {
  let stdout = ''
  let stderr = ''
  const exitCode = await exec(
    `/bin/bash -c "set -o pipefail && git tag -l --sort=-v:refname | head -n 1"`,
    undefined,
    {
      listeners: {
        stdout: (data: Buffer) => {
          stdout += data.toString()
        },
        stderr: (data: Buffer) => {
          stderr += data.toString()
        },
      },
    }
  )
  if (stderr) {
    console.error(stderr.trim())
  }
  if (exitCode !== 0) {
    throw new Error(`Failed to get latest tag: ${exitCode}`)
  }
  return stdout.trim() || null
}
