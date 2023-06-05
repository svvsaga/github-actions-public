## Description

Apply Terraform plan from artifact in previous job

## Inputs

| parameter | description | required | default |
| --- | --- | --- | --- |
| terraform_dir | The working directory, e.g. where the Terraform files are located. | `true` |  |
| ref | Which commit, tag or branch to plan terraform from. Defaults to same as workflow is run from if empty. | `false` | ${{ github.sha }} |
| service_account_key | Service account key for the Terraform service account. Use either this or Workload Identity Federation. | `false` |  |
| environment | STM, ATM, PROD or SHARED. Used to setup Terragrunt and Workload Identity Federation. Must be set if service_account_key is not set. | `false` |  |
| github_token | Token used when authenticating with GitHub. Defaults to `github.token`. | `false` | ${{ github.token }} |
| plan_artifact_name | Name of the plan file to download from GitHub artifacts. Defaults to "terraform.plan". | `false` | terraform.plan |
| tf_backend_config | Terraform backend configuration to use. See https://www.terraform.io/docs/language/settings/backends/configuration.html#partial-configuration. | `false` |  |


## Runs

This action is a `composite` action.


