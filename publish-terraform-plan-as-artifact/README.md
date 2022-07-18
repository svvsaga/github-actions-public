## Description

Publish Terraform plan as artifact

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| terraform_dir | The working directory, e.g. where the Terraform files are located. | `true` |  |
| plan_bucket | The GCS bucket where the Terraform plan description will be stored. | `true` |  |
| plan_prefix | Folder / prefix to add to the plan description file name in GCS. E.g. "terraform-plans/my-app". | `true` |  |
| ref | Which commit, tag or branch to plan terraform from. Defaults to same as workflow is run from if empty. | `false` | ${{ github.sha }} |
| workload_identity_project_id | The project ID of the workload identity project to use with `gcloud`. Will be used to set the `terraform@<workload_identity_project_id>.iam.gserviceaccount.com` service account. | `false` |  |
| workload_identity_project_number | The project number of the workload identity project to use with `gcloud`. Will be used to set workload identity provider to `projects/<workload_identity_project_number>/locations/global/workloadIdentityPools/default/providers/github`. | `false` |  |
| service_account_key | Service account key for the Terraform service account. Use either this or Workload Identity Federation. | `false` |  |
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


