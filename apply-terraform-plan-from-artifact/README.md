## Description

Apply Terraform plan from artifact in previous job

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `terraform_dir` | <p>The working directory, e.g. where the Terraform files are located.</p> | `true` | `""` |
| `ref` | <p>Which commit, tag or branch to plan terraform from. Defaults to same as workflow is run from if empty.</p> | `false` | `${{ github.sha }}` |
| `service_account_key` | <p>Service account key for the Terraform service account. Use either this or Workload Identity Federation.</p> | `false` | `""` |
| `environment` | <p>STM, ATM, PROD or SHARED. Used to setup Terragrunt and Workload Identity Federation. Must be set if service<em>account</em>key is not set.</p> | `false` | `""` |
| `github_token` | <p>Token used when authenticating with GitHub. Defaults to <code>github.token</code>.</p> | `false` | `${{ github.token }}` |
| `plan_artifact_name` | <p>Name of the plan file to download from GitHub artifacts. Defaults to "terraform.plan".</p> | `false` | `terraform.plan` |
| `tf_backend_config` | <p>Terraform backend configuration to use. See https://www.terraform.io/docs/language/settings/backends/configuration.html#partial-configuration.</p> | `false` | `""` |


## Runs

This action is a `composite` action.


