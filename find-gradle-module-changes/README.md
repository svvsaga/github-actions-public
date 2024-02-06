## Description

Find changes in Gradle root modules, defined as a folder with `gradlew` present.

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `token` | <p>GitHub token. Defaults to <code>github.token</code>.</p> | `true` | `${{ github.token }}` |
| `include_all` | <p>Whether to list all modules, or only changed modules. Defaults to <code>false</code>.</p> | `true` | `false` |
| `ignore_modules` | <p>Comma-separated list of relative paths to ignore. Must include dot at start of relative path, e.g. <code>., ./system/alpha</code>.</p> | `false` | `""` |
| `ignore_modules_regex` | <p>Regex of modules to ignore, e.g. 'utils/.*'.</p> | `false` | `""` |
| `cwd` | <p>Relative path to use for searching and as root for <code>matrix.path</code> outputs. Defaults to repo root.</p> | `true` | `.` |


## Outputs

| name | description |
| --- | --- |
| `matrix` | <p>Matrix of Gradle modules with changes in this PR/push. Use <code>matrix.path</code> for full path, <code>matrix.segments</code> for an array of each path segment, or <code>matrix.folder</code> for the single folder containing the module.</p> |
| `has_results` | <p>Whether the matrix is empty or not; <code>true</code> if there are more than zero results, <code>false</code> otherwise.</p> |


## Runs

This action is a `node20` action.


