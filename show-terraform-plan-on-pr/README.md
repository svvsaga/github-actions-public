## Description

Show Terraform plan on PR

## Inputs

| parameter | description | required | default |
| --- | --- | --- | --- |
| terraform_dir | The working directory, e.g. where the Terraform files are located. | `true` |  |
| service_account_key | Terraform Service Account private key to use with `gcloud`. If not specified, will be read from 'tf-pr-action-config.json'. If not set there either, Workload Identity Federation with project.config.json will be used, based on environment in `tf-pr-action-config.json`. | `false` |  |
| github_token | Token used when authenticating with GitHub. Defaults to `github.token`. | `false` | ${{ github.token }} |
| secrets_json | JSON string containing secrets to pass to Terraform. | `false` | {} |
| upload_plan_bucket | GCS bucket to upload the plan to. | `false` |  |


## Runs

This action is a `composite` action.


