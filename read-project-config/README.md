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
| project_numbers_by_environment | Project numbers by environment (as stringified JSON) |
| environments | List of environments (as stringified JSON) |
| matrix | Matrix of environments with project IDs and numbers. Use `matrix.environment` for environment, `matrix.project_id` for project ID, and `matrix.project_number` for project number. |
| has_matrix | Whether the matrix is empty or not; `true` if there are more than zero results, `false` otherwise. |


## Runs

This action is a `node16` action.


