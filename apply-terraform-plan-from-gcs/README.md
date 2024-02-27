## Description

Apply Terraform plan from storage bucket. Requires that Google Cloud SDK has been setup.


## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `ref` | <p>Which release to deploy, e.g. "datacatalog-web-v13"</p> | `true` | `""` |
| `project_root` | <p>Where to find the terraform directory.</p> | `true` | `""` |
| `environment` | <p>Which environment to deploy plan for (STM, ATM, PROD).</p> | `true` | `STM` |
| `storage_bucket` | <p>Where to read the Terraform plan.</p> | `true` | `""` |
| `application` | <p>Name of the application that is being deployed, e.g. 'Oppetid'.</p> | `true` | `""` |
| `github_token` | <p>Token used to create and update GitHub deployment.</p> | `true` | `""` |
| `skip_diff` | <p>Set to 'true' to apply Terraform plan without checking if state has changed since plan was created.</p> | `false` | `""` |
| `storage_prefix` | <p>Subfolder in storage bucket. If set, plans will be read from <code>&lt;storage_prefix&gt;/terraform-plans</code>.</p> | `false` | `""` |


## Runs

This action is a `node20` action.


