     _       ____   _____   ___    ___    _   _           ____     ___     ____   ____  
    / \     / ___| |_   _| |_ _|  / _ \  | \ | |         |  _ \   / _ \   / ___| / ___| 
   / _ \   | |       | |    | |  | | | | |  \| |  _____  | | | | | | | | | |     \___ \ 
  / ___ \  | |___    | |    | |  | |_| | | |\  | |_____| | |_| | | |_| | | |___   ___) |
 /_/   \_\  \____|   |_|   |___|  \___/  |_| \_|         |____/   \___/   \____| |____/ 
                                                                                        
## Description

Finds Terraform settings, including .terraform-version, .terragrunt-version and terragrunt dependencies.

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| cwd | Relative path to use for searching and as root for `matrix.path` outputs. Defaults to repo root. | `true` | . |


## Outputs

| parameter | description |
| - | - |
| tf_version | Terraform version |
| tg_version | Terragrunt version |
| tg_dependencies | Terragrunt dependencies (as a list of strings) |


## Runs

This action is a `node16` action.


