## Description

Setup Workload Identity Federation and GCloud SDK. Code must be checked out first, to set Google application credentials.

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `project_id` | <p>The project ID of the workload identity project to use with <code>gcloud</code>. Will be used to set the <code>&lt;service_account&gt;@&lt;project_id&gt;.iam.gserviceaccount.com</code> service account. If not set, <code>environment</code> and <code>app_root</code> must be set and <code>projects.config.json</code> must be present.</p> | `false` | `""` |
| `project_number` | <p>The project number of the project where the workload identity provider exists. Will be used to set workload identity provider to <code>projects/&lt;project_number&gt;/locations/global/workloadIdentityPools/&lt;pool_id&gt;/providers/&lt;provider_id&gt;</code>. If not set, <code>environment</code> and <code>app_root</code> must be set and <code>projects.config.json</code> must be present.</p> | `false` | `""` |
| `environment` | <p>The environment to use for finding the project ID and workload identity provider. If not set, <code>project_id</code> and <code>project_number</code> must be set.</p> | `false` | `""` |
| `app_root` | <p>The root directory to use for searching for <code>projects.config.json</code>. If not set, <code>project_id</code> and <code>project_number</code> must be set.</p> | `false` | `""` |
| `service_account` | <p>The service account to use with <code>gcloud</code>. Defaults to <code>terraform</code>.</p> | `false` | `terraform` |
| `access_token_scopes` | <p>List of oauth 2.0 access scopes to be included in the generated token</p> | `false` | `https://www.googleapis.com/auth/cloud-platform` |
| `pool_id` | <p>The pool ID of the workload identity pool to use with <code>gcloud</code>. Defaults to <code>default</code>.</p> | `false` | `default` |
| `provider_id` | <p>The provider ID of the workload identity provider to use with <code>gcloud</code>. Defaults to <code>github</code>.</p> | `false` | `github` |


## Outputs

| name | description |
| --- | --- |
| `credentials_file_path` | <p>The path to the credentials file used by <code>gcloud</code> to authenticate with the Workload Identity provider.</p> |
| `access_token` | <p>The access token to use with <code>gcloud</code></p> |


## Runs

This action is a `composite` action.


