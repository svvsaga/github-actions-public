## Description

End a GitHub deployment, setting status to either 'success' or 'failure'.

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `deployment_id` | <p>ID of the deployment to end.</p> | `true` | `""` |
| `success` | <p>Set to 'true' to end deployment with status 'success', otherwise 'failure'.</p> | `true` | `""` |
| `github_token` | <p>Token used to update GitHub deployment. Defaults to <code>github.token</code>.</p> | `true` | `${{ github.token }}` |


## Runs

This action is a `node20` action.


