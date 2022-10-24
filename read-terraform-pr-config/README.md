## Description

Finds Terraform settings to use when running PR actions.

## Inputs

| parameter | description | required | default |
| --- | --- | --- | --- |
| cwd | Relative path to use for searching and as root for `matrix.path` outputs. Defaults to repo root. | `true` | . |
| secrets_json | JSON string containing secrets to use for Terraform. | `false` | {} |


## Outputs

| parameter | description |
| --- | --- |
| tf_vars | Terraform variables (as stringified JSON) |
| sa_secret | Name of service account secret |
| sa_secret_key | Service account secret key |
| environment | Environment name to use when running Terraform PR actions |
| workload_identity_project_id | Project ID for the workload identity federation authentication |
| workload_identity_project_number | Project number for the workload identity federation authentication |


## Runs

This action is a `node16` action.


