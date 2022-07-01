## Description

Creates a GitHub token for the GitHub App and sets it as GITHUB_TOKEN, as well as configures git to add it to all github.com HTTP calls.

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| private_key | Private key for the GitHub App | `true` |  |
| app_id | GitHub App ID | `true` |  |


## Outputs

| parameter | description |
| - | - |
| token | GitHub token |


## Runs

This action is a `composite` action.


