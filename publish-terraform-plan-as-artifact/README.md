## Description

Publish Terraform plan as artifact

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `terraform_dir` | <p>The working directory, e.g. where the Terraform files are located.</p> | `true` | `""` |
| `plan_bucket` | <p>The GCS bucket where the Terraform plan description will be stored.</p> | `true` | `""` |
| `plan_prefix` | <p>Folder / prefix to add to the plan description file name in GCS. E.g. "terraform-plans/my-app".</p> | `true` | `""` |
| `ref` | <p>Which commit, tag or branch to plan terraform from. Defaults to same as workflow is run from if empty.</p> | `false` | `${{ github.sha }}` |
| `service_account_key` | <p>Service account key for the Terraform service account. Use either this or Workload Identity Federation.</p> | `false` | `""` |
| `environment` | <p>STM, ATM, PROD or SHARED. Used to setup Workload Identity Federation. Must be set if service<em>account</em>key is not set.</p> | `false` | `""` |
| `github_token` | <p>Token used when authenticating with GitHub. Defaults to <code>github.token</code>.</p> | `false` | `${{ github.token }}` |
| `plan_artifact_name` | <p>Name of the plan file to upload to GitHub artifacts. Defaults to "terraform.plan".</p> | `false` | `terraform.plan` |
| `tf_backend_config` | <p>Terraform backend configuration to use. See https://www.terraform.io/docs/language/settings/backends/configuration.html#partial-configuration.</p> | `false` | `""` |
| `secrets_json` | <p>Secrets to use for Terraform, used to replace environment variables in "secrets.auto.tfvars". Optional.</p> | `false` | `""` |


## Outputs

| name | description |
| --- | --- |
| `has_changes` | <p>Whether the plan has changes.</p> |
| `plan_description_url` | <p>Full URL of the plan description.</p> |


## Runs

This action is a `composite` action.


