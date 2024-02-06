## Description

Finds Terraform settings, including .terraform-version, .terragrunt-version and terragrunt dependencies.

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `cwd` | <p>Relative path to use for searching and as root for <code>matrix.path</code> outputs. Defaults to repo root.</p> | `true` | `.` |


## Outputs

| name | description |
| --- | --- |
| `tf_version` | <p>Terraform version</p> |
| `tg_version` | <p>Terragrunt version</p> |
| `tg_dependencies` | <p>Terragrunt dependencies (as a list of strings)</p> |


## Runs

This action is a `node20` action.


