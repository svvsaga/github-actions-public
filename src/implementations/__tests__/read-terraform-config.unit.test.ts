import { readTerragruntDependencies } from '~/read-terraform-config'

describe('readTerragruntDependencies', () => {
  it('should return an empty array when no dependencies are found', () => {
    const result = readTerragruntDependencies('')
    expect(result).toEqual([])
  })

  it('should return an array of dependencies when dependencies are found', () => {
    const result = readTerragruntDependencies(`
include {
  path = find_in_parent_folders()
}

dependency "parent" {
  config_path = "../../terraform"

  mock_outputs_allowed_terraform_commands = ["validate", "init", "fmt", "plan"]
  mock_outputs_merge_with_state           = true
}
dependency "alpha" {
  config_path = "../alpha"
}
    `)
    expect(result).toEqual(['../../terraform', '../alpha'])
  })
})
