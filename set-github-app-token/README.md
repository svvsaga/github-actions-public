## Description

Creates a GitHub token for the GitHub App and sets it as GITHUB_TOKEN, as well as configures git to add it to all github.com HTTP calls.

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `private_key` | <p>Private key for the GitHub App</p> | `true` | `""` |
| `app_id` | <p>GitHub App ID</p> | `true` | `""` |


## Outputs

| name | description |
| --- | --- |
| `token` | <p>GitHub token</p> |


## Runs

This action is a `composite` action.


