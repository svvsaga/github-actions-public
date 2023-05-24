## Description

Apply Terraform plan from storage bucket. Requires that Google Cloud SDK has been setup. We use this action when plan and apply happens in separate workflows.

## Inputs

| parameter | description | required | default |
| --- | --- | --- | --- |
| project_root | Where to find the terraform directory. | `true` |  |
| environment | Which environment to deploy plan for (STM, ATM, PROD). | `true` | STM |
| storage_bucket | Where to read the Terraform plan. | `true` |  |
| application | Name of the application that is being deployed, e.g. 'Oppetid'. | `true` |  |
| github_token | Token used to create and update GitHub deployment. | `true` |  |
| skip_diff | Set to 'true' to apply Terraform plan without checking if state has changed since plan was created. | `false` |  |
| storage_prefix | Subfolder in storage bucket. If set, plans will be read from `<storage_prefix>/terraform-plans`. | `false` |  |


## Runs

This action is a `node16` action.


