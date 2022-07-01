## Description

Find changes in modules in a pull request or push. Requires checking out the code beforehand.

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| token | GitHub token. Defaults to `github.token`. | `true` | ${{ github.token }} |
| include_all | Whether to list all modules, or only changed modules. Defaults to `false`. | `true` | false |
| marker | A file that marks the root of a module. | `true` |  |
| ignore_modules | Comma-separated list of relative paths to ignore. Must include dot at start of relative path, e.g. `., ./system/alpha`. | `false` |  |
| ignore_modules_regex | Regex of modules to ignore, e.g. 'utils/.*'. | `false` |  |
| cwd | Relative path to use for searching and as root for `matrix.path` outputs. Defaults to repo root. | `true` | . |
| include_removed | Whether removed files should trigger changes. Defaults to true. | `true` | true |


## Outputs

| parameter | description |
| - | - |
| matrix | Matrix of paths with changes in this PR/push. Use `matrix.path` for full path, `matrix.segments` for an array of each path segment, or `matrix.folder` for the single folder containing the module. |
| has_results | Whether the matrix is empty or not; `true` if there are more than zero results, `false` otherwise. |


## Runs

This action is a `node16` action.


