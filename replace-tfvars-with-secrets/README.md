## Description

Replace Terraform variables with secrets

## Inputs

| parameter | description | required | default |
| --- | --- | --- | --- |
| secrets_json | JSON string containing secrets to use for Terraform. | `true` |  |
| terraform_dir | The working directory, e.g. where the Terraform files are located. | `true` |  |
| secrets_file | The path to the Terraform tvars secrets file. | `true` | secrets.auto.tfvars |


## Runs

This action is a `node16` action.


