## Description

Create a GitHub deployment and set status to in_progress. Will connect deployment to a GitHub Environment (see https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment).

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `ref` | <p>Git ref to deploy. Defaults to current commit.</p> | `false` | `${{ github.sha }}` |
| `environment` | <p>Which environment to deploy plan for (e.g. STM, ATM, PROD). Will be used as part of GitHub Environment name. Optional.</p> | `false` | `""` |
| `application` | <p>Name of the application that is being deployed, e.g. 'Oppetid'. Will be used as part of GitHub Environment name.</p> | `true` | `""` |
| `github_token` | <p>Token used to create and update GitHub deployment. Defaults to <code>github.token</code>.</p> | `true` | `${{ github.token }}` |
| `environment_suffix` | <p>Suffix to add to GitHub Environment name, e.g. 'TF'.</p> | `false` | `""` |


## Outputs

| name | description |
| --- | --- |
| `deployment_id` | <p>ID of the created GitHub deployment.</p> |


## Runs

This action is a `node20` action.


