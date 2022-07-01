## Description

Setup GCloud SDK. If service account key is passed, it will be used, otherwise the action looks for a `projects.config.json` file in the app root, and uses the project ID and number for the given environment.

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| service_account_key | The service account JSON secret key to use with `gcloud`. | `false` |  |
| app_root | The root directory to use for searching for `projects.config.json`. | `false` |  |
| environment | The environment to use for finding the project ID and number. | `false` |  |


## Outputs

| parameter | description |
| - | - |
| credentials_file_path | The path to the credentials file used by `gcloud` to authenticate with the Workload Identity provider. |
| access_token | The access token to use with `gcloud` |


## Runs

This action is a `composite` action.


