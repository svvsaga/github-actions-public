## Description

Publish Terraform plan as artifact

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| terraform_dir | The working directory, e.g. where the Terraform files are located. | `true` |  |
| plan_bucket | The GCS bucket where the Terraform plan description will be stored. | `true` |  |
| plan_prefix | Folder / prefix to add to the plan description file name in GCS. E.g. "terraform-plans/my-app". | `true` |  |
| ref | Which commit, tag or branch to plan terraform from. Defaults to same as workflow is run from if empty. | `false` | ${{ github.sha }} |
| service_account_key | Service account key for the Terraform service account. Use either this or Workload Identity Federation. | `false` |  |
| environment | STM, ATM, PROD or SHARED. Used to setup Workload Identity Federation. Must be set if service_account_key is not set. | `false` |  |
| github_token | Token used when authenticating with GitHub. Defaults to `github.token`. | `false` | ${{ github.token }} |
| plan_artifact_name | Name of the plan file to upload to GitHub artifacts. Defaults to "terraform.plan". | `false` | terraform.plan |
| tf_backend_config | Terraform backend configuration to use. See https://www.terraform.io/docs/language/settings/backends/configuration.html#partial-configuration. | `false` |  |
| secrets_json | Secrets to use for Terraform, used to replace environment variables in "secrets.auto.tfvars". Optional. | `false` |  |


## Outputs

| parameter | description |
| - | - |
| has_changes | Whether the plan has changes. |
| plan_description_url | Full URL of the plan description. |


## Runs

This action is a `composite` action.


