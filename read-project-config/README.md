     _       ____   _____   ___    ___    _   _           ____     ___     ____   ____  
    / \     / ___| |_   _| |_ _|  / _ \  | \ | |         |  _ \   / _ \   / ___| / ___| 
   / _ \   | |       | |    | |  | | | | |  \| |  _____  | | | | | | | | | |     \___ \ 
  / ___ \  | |___    | |    | |  | |_| | | |\  | |_____| | |_| | | |_| | | |___   ___) |
 /_/   \_\  \____|   |_|   |___|  \___/  |_| \_|         |____/   \___/   \____| |____/ 
                                                                                        
## Description

Finds project IDs by environment

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| cwd | Relative path to use for searching. Defaults to repo root. Will search upwards for config_file. | `true` | . |
| config_file | Which file that contains the project config. Defaults to "projects.config.json". | `true` | projects.config.json |
| required | Whether action should fail if no config file is found. | `false` | false |


## Outputs

| parameter | description |
| - | - |
| project_ids_by_environment | Project IDs by environment (as stringified JSON) |


## Runs

This action is a `node16` action.


