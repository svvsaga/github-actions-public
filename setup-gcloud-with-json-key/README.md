## Description

Setup GCloud SDK with service account JSON secret key. Code must be checked out first, to set Google application credentials.

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| service_account_key | The service account JSON secret key to use with `gcloud`. | `true` |  |


## Outputs

| parameter | description |
| - | - |
| credentials_file_path | The path to the credentials file used by `gcloud` to authenticate with the Workload Identity provider. |


## Runs

This action is a `composite` action.


