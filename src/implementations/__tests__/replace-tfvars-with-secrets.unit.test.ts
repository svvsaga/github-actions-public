import { describe, expect, it } from 'vitest'
import { replaceTfvars } from '../replace-tfvars-with-secrets'

describe('replaceTfvars', () => {
  it('replaces secrets that are found and leave the rest alone', () => {
    const tfvars = `var_one="$FIRST_SECRET"
    var_two="$SECOND_SECRET"
    var_three="something else"
    var_four="$MISSING_SECRET"`
    const secrets = {
      FIRST_SECRET: 'first-secret',
      SECOND_SECRET: 'second-secret',
    }

    const replaced = replaceTfvars(tfvars, secrets)

    expect(replaced).toBe(`var_one="first-secret"
    var_two="second-secret"
    var_three="something else"
    var_four="$MISSING_SECRET"`)
  })
})
