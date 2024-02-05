## Description

Finds integration testing settings

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `cwd` | <p>Relative path to use for searching and as root for <code>matrix.path</code> outputs. Defaults to repo root.</p> | `true` | `.` |


## Outputs

| name | description |
| --- | --- |
| `environment` | <p>Environment name</p> |
| `workload_identity_project_id` | <p>Project ID for the workload identity federation authentication</p> |
| `workload_identity_project_number` | <p>Project number for the workload identity federation authentication</p> |
| `service_account` | <p>Service account to be used to run integration tests. Only user part (until "@[domain]"). Default is "project-service-account".</p> |


## Runs

This action is a `node16` action.


