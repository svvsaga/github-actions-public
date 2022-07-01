     _       ____   _____   ___    ___    _   _           ____     ___     ____   ____  
    / \     / ___| |_   _| |_ _|  / _ \  | \ | |         |  _ \   / _ \   / ___| / ___| 
   / _ \   | |       | |    | |  | | | | |  \| |  _____  | | | | | | | | | |     \___ \ 
  / ___ \  | |___    | |    | |  | |_| | | |\  | |_____| | |_| | | |_| | | |___   ___) |
 /_/   \_\  \____|   |_|   |___|  \___/  |_| \_|         |____/   \___/   \____| |____/ 
                                                                                        
## Description

Setup GCloud SDK with service account JSON secret key. Code must be checked out first, to set Google application credentials.

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| service_account_key | The service account JSON secret key to use with `gcloud`. | `true` |  |


## Outputs

| parameter | description |
| - | - |
| credentials_file_path | The path to the credentials file used by `gcloud` to authenticate with the Workload Identity provider. |


## Runs

This action is a `composite` action.


