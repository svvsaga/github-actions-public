## Description

Publish Terraform plan to storage bucket. Requires that Google Cloud SDK has been setup.


## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `project_root` | <p>Where to find the terraform directory.</p> | `true` | `""` |
| `environment` | <p>Which environment to publish plan for (STM, ATM, PROD, SHARED).</p> | `true` | `STM` |
| `release_id` | <p>If it should upload the plan text version to a release, add the release ID number.</p> | `false` | `""` |
| `terraform_vars` | <p>Additional variables for Terraform in .tfvar-format with quotes escaped and newlines, e.g. 'foo = \"abc\"\nbar = \"def\"'</p> | `false` | `""` |
| `storage_bucket` | <p>Where to store the Terraform plan.</p> | `true` | `""` |
| `storage_prefix` | <p>Subfolder in storage bucket. If set, plans will be stored in <code>&lt;storage_prefix&gt;/terraform-plans</code>.</p> | `false` | `""` |


## Runs

This action is a `node16` action.


