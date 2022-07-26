## Description

Setup GCloud SDK. If service account key is passed, it will be used, otherwise the action looks for a `projects.config.json` file in the app root, and uses the project ID and number for the given environment to set up Workload Identity Federation. To generate a `projects.config.json`, see `npx generate-gcp-project-config` from https://github.com/svvsaga/node-modules-public.

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| service_account_key | The service account JSON secret key to use with `gcloud`. Either this or `app_root` and `environment` must be set. | `false` |  |
| app_root | The root directory to use for searching for `projects.config.json`. | `false` |  |
| environment | The environment to use for finding the project ID and number. Typically "STM", "ATM", "PROD" or "SHARED". | `false` |  |
| service_account | The service account to use with Workload Identity Federation. Defaults to `terraform`. Not used if `service_account_key` is set. | `false` | terraform |


## Outputs

| parameter | description |
| - | - |
| credentials_file_path | The path to the credentials file used by `gcloud`. |
| access_token | The access token used with `gcloud` if WIF is used. |


## Runs

This action is a `composite` action.


