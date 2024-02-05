## Description

Show Terraform plan on PR

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `terraform_dir` | <p>The working directory, e.g. where the Terraform files are located.</p> | `true` | `""` |
| `service_account_key` | <p>Terraform Service Account private key to use with <code>gcloud</code>. If not specified, will be read from 'tf-pr-action-config.json'. If not set there either, Workload Identity Federation with project.config.json will be used, based on environment in <code>tf-pr-action-config.json</code>.</p> | `false` | `""` |
| `github_token` | <p>Token used when authenticating with GitHub. Defaults to <code>github.token</code>.</p> | `false` | `${{ github.token }}` |
| `secrets_json` | <p>JSON string containing secrets to pass to Terraform.</p> | `false` | `{}` |
| `upload_plan_bucket` | <p>GCS bucket to upload the plan to.</p> | `false` | `""` |


## Runs

This action is a `composite` action.


