## Description

Setup GCloud SDK. If service account key is passed, it will be used, otherwise the action looks for a `projects.config.json` file in the app root, and uses the project ID and number for the given environment to set up Workload Identity Federation. To generate a `projects.config.json`, see `npx generate-gcp-project-config` from https://github.com/svvsaga/node-modules-public.

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `service_account_key` | <p>The service account JSON secret key to use with <code>gcloud</code>. Either this or <code>app_root</code> and <code>environment</code> must be set.</p> | `false` | `""` |
| `app_root` | <p>The root directory to use for searching for <code>projects.config.json</code>.</p> | `false` | `""` |
| `environment` | <p>The environment to use for finding the project ID and number. Typically "STM", "ATM", "PROD" or "SHARED".</p> | `false` | `""` |
| `service_account` | <p>The service account to use with Workload Identity Federation. Defaults to <code>terraform</code>. Not used if <code>service_account_key</code> is set.</p> | `false` | `terraform` |


## Outputs

| name | description |
| --- | --- |
| `credentials_file_path` | <p>The path to the credentials file used by <code>gcloud</code>.</p> |
| `access_token` | <p>The access token used with <code>gcloud</code> if WIF is used.</p> |


## Runs

This action is a `composite` action.


