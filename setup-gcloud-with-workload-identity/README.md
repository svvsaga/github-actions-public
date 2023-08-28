## Description

Setup Workload Identity Federation and GCloud SDK. Code must be checked out first, to set Google application credentials.

## Inputs

| parameter | description | required | default |
| --- | --- | --- | --- |
| project_id | The project ID of the workload identity project to use with `gcloud`. Will be used to set the `<service_account>@<project_id>.iam.gserviceaccount.com` service account. If not set, `environment` and `app_root` must be set and `projects.config.json` must be present. | `false` |  |
| project_number | The project number of the project where the workload identity provider exists. Will be used to set workload identity provider to `projects/<project_number>/locations/global/workloadIdentityPools/<pool_id>/providers/<provider_id>`. If not set, `environment` and `app_root` must be set and `projects.config.json` must be present. | `false` |  |
| environment | The environment to use for finding the project ID and workload identity provider. If not set, `project_id` and `project_number` must be set. | `false` |  |
| app_root | The root directory to use for searching for `projects.config.json`. If not set, `project_id` and `project_number` must be set. | `false` |  |
| service_account | The service account to use with `gcloud`. Defaults to `terraform`. | `false` | terraform |
| access_token_scopes | List of oauth 2.0 access scopes to be included in the generated token | `false` | https://www.googleapis.com/auth/cloud-platform |
| pool_id | The pool ID of the workload identity pool to use with `gcloud`. Defaults to `default`. | `false` | default |
| provider_id | The provider ID of the workload identity provider to use with `gcloud`. Defaults to `github`. | `false` | github |


## Outputs

| parameter | description |
| --- | --- |
| credentials_file_path | The path to the credentials file used by `gcloud` to authenticate with the Workload Identity provider. |
| access_token | The access token to use with `gcloud` |


## Runs

This action is a `composite` action.


