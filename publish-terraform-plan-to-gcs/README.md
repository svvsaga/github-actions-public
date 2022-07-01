## Description

Publish Terraform plan to storage bucket. Requires that Google Cloud SDK has been setup.


## Inputs

| parameter | description | required | default |
| - | - | - | - |
| project_root | Where to find the terraform directory. | `true` |  |
| environment | Which environment to publish plan for (STM, ATM, PROD, SHARED). | `true` | STM |
| release_id | If it should upload the plan text version to a release, add the release ID number. | `false` |  |
| terraform_vars | Additional variables for Terraform in .tfvar-format with quotes escaped and newlines, e.g. 'foo = \"abc\"\nbar = \"def\"' | `false` |  |
| storage_bucket | Where to store the Terraform plan. | `true` |  |
| storage_prefix | Subfolder in storage bucket. If set, plans will be stored in `<storage_prefix>/terraform-plans`. | `false` |  |


## Runs

This action is a `node16` action.


