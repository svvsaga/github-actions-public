## Description

Finds Terraform settings, including .terraform-version, .terragrunt-version and terragrunt dependencies.

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| cwd | Relative path to use for searching and as root for `matrix.path` outputs. Defaults to repo root. | `true` | . |


## Outputs

| parameter | description |
| - | - |
| tf_version | Terraform version |
| tg_version | Terragrunt version |
| tg_dependencies | Terragrunt dependencies (as a list of strings) |


## Runs

This action is a `node16` action.


