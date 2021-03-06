import * as core from '@actions/core'
import { bumpSemverTag } from './implementations/bump-semver-tag'

async function run(): Promise<void> {
  try {
    await bumpSemverTag()
  } catch (error) {
    core.setFailed(error as Error)
  }
}

void run()
