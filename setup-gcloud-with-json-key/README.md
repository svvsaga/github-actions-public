## Description

Setup GCloud SDK with service account JSON secret key. Code must be checked out first, to set Google application credentials.

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `service_account_key` | <p>The service account JSON secret key to use with <code>gcloud</code>.</p> | `true` | `""` |


## Outputs

| name | description |
| --- | --- |
| `credentials_file_path` | <p>The path to the credentials file used by <code>gcloud</code> to authenticate with the Workload Identity provider.</p> |


## Runs

This action is a `composite` action.


