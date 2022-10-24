## Description

Finds integration testing settings

## Inputs

| parameter | description | required | default |
| --- | --- | --- | --- |
| cwd | Relative path to use for searching and as root for `matrix.path` outputs. Defaults to repo root. | `true` | . |


## Outputs

| parameter | description |
| --- | --- |
| environment | Environment name |
| workload_identity_project_id | Project ID for the workload identity federation authentication |
| workload_identity_project_number | Project number for the workload identity federation authentication |
| service_account | Service account to be used to run integration tests. Only user part (until "@[domain]"). Default is "project-service-account". |


## Runs

This action is a `node16` action.


