#!/usr/bin/env ts-node

import fs from 'fs'

for (const file of process.argv.slice(2)) {
  const contents = fs.readFileSync(file, 'utf8')
  if (
    (contents.includes('-----BEGIN PRIVATE') ||
      contents.includes('-----BEGIN CERTIFICATE')) &&
    !file.endsWith('check-for-secrets.ts')
  ) {
    console.error(
      `Private key detected in ${file}! To override, commit with "--no-verify".`
    )
    process.exit(1)
  }
}
