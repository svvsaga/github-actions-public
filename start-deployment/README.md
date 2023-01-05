## Description

Create a GitHub deployment and set status to in_progress. Will connect deployment to a GitHub Environment (see https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment).

## Inputs

| parameter | description | required | default |
| --- | --- | --- | --- |
| ref | Git ref to deploy. Defaults to current commit. | `false` | ${{ github.sha }} |
| environment | Which environment to deploy plan for (e.g. STM, ATM, PROD). Will be used as part of GitHub Environment name. Optional. | `false` |  |
| application | Name of the application that is being deployed, e.g. 'Oppetid'. Will be used as part of GitHub Environment name. | `true` |  |
| github_token | Token used to create and update GitHub deployment. Defaults to `github.token`. | `true` | ${{ github.token }} |
| environment_suffix | Suffix to add to GitHub Environment name, e.g. 'TF'. | `false` |  |


## Outputs

| parameter | description |
| --- | --- |
| deployment_id | ID of the created GitHub deployment. |


## Runs

This action is a `node16` action.


