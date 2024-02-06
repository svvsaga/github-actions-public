## Description

Finds Terraform settings to use when running PR actions.

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `cwd` | <p>Relative path to use for searching and as root for <code>matrix.path</code> outputs. Defaults to repo root.</p> | `true` | `.` |
| `secrets_json` | <p>JSON string containing secrets to use for Terraform.</p> | `false` | `{}` |


## Outputs

| name | description |
| --- | --- |
| `tf_vars` | <p>Terraform variables (as stringified JSON)</p> |
| `sa_secret` | <p>Name of service account secret</p> |
| `sa_secret_key` | <p>Service account secret key</p> |
| `environment` | <p>Environment name to use when running Terraform PR actions</p> |
| `workload_identity_project_id` | <p>Project ID for the workload identity federation authentication</p> |
| `workload_identity_project_number` | <p>Project number for the workload identity federation authentication</p> |


## Runs

This action is a `node20` action.


