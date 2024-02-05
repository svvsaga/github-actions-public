## Description

Reads the latest tag, increments the version if a \#major, \#minor or \#patch tag is found in any commit msg in push, and creates a new tag.

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `token` | <p>GitHub token. Defaults to <code>github.token</code>.</p> | `true` | `${{ github.token }}` |


## Outputs

| name | description |
| --- | --- |
| `tag` | <p>The new tag, or empty string if no tag was created.</p> |
| `version` | <p>The new version (tag without v-prefix), or empty string if no version was incremented.</p> |


## Runs

This action is a `node16` action.


