## Description

Replace Terraform variables with secrets

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `secrets_json` | <p>JSON string containing secrets to use for Terraform.</p> | `true` | `""` |
| `terraform_dir` | <p>The working directory, e.g. where the Terraform files are located.</p> | `true` | `""` |
| `secrets_file` | <p>The path to the Terraform tvars secrets file.</p> | `true` | `secrets.auto.tfvars` |


## Runs

This action is a `node20` action.


