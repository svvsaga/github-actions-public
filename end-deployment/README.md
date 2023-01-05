## Description

End a GitHub deployment, setting status to either 'success' or 'failure'.

## Inputs

| parameter | description | required | default |
| --- | --- | --- | --- |
| deployment_id | ID of the deployment to end. | `true` |  |
| success | Set to 'true' to end deployment with status 'success', otherwise 'failure'. | `true` |  |
| github_token | Token used to update GitHub deployment. Defaults to `github.token`. | `true` | ${{ github.token }} |


## Runs

This action is a `node16` action.


