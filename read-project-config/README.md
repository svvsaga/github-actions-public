## Description

Finds project IDs by environment

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `cwd` | <p>Relative path to use for searching. Defaults to repo root. Will search upwards for config_file.</p> | `true` | `.` |
| `config_file` | <p>Which file that contains the project config. Defaults to "projects.config.json".</p> | `true` | `projects.config.json` |
| `required` | <p>Whether action should fail if no config file is found.</p> | `false` | `false` |


## Outputs

| name | description |
| --- | --- |
| `project_ids_by_environment` | <p>Project IDs by environment (as stringified JSON)</p> |
| `project_numbers_by_environment` | <p>Project numbers by environment (as stringified JSON)</p> |
| `environments` | <p>List of environments (as stringified JSON)</p> |
| `matrix` | <p>Matrix of environments with project IDs and numbers. Use <code>matrix.environment</code> for environment, <code>matrix.project_id</code> for project ID, and <code>matrix.project_number</code> for project number.</p> |
| `has_matrix` | <p>Whether the matrix is empty or not; <code>true</code> if there are more than zero results, <code>false</code> otherwise.</p> |


## Runs

This action is a `node20` action.


