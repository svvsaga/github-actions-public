# GitHub Actions

Useful GitHub Actions!

## Publishing new versions

We follow semantic versioning when publishing new versions.

To publish, first make sure your changes are committed. Then:

1. If there are breaking changes: `npm run publish:major`
1. If there are new features but no breaking changes: `npm run publish:minor`
1. If there are no new features, just bug fixes or other improvements: `npm run publish:patch`

### Automatic publishing

A new version will automatically be published when there are any changes to a `.ts`-file pushed to master.

1. If any commit in the push has a commit message containing `#major`, a major version will be published.
1. If any commit in the push has a commit message containing `#minor`, a minor version will be published.
1. Otherwise, a patch version will be published.

## Add new actions

- Make a file in `src`, e.g. `src/my-action.ts`
- Add an npm script similar to `"package:my-action": "ncc build lib/my-action.js --source-map -o my-action"`
- Make a folder `my-action`
- Add a `action.yml` file

### Tree shaking

**NOTE: No tree shaking is applied, so import e.g. `lodash-es`-modules directly: `import uniq from 'lodash-es/uniq'` rather than `import { uniq } from 'lodash-es`.**

## Use actions

In your workflow from another repo:

```yaml
jobs:
  build:
    steps:
      - name: My Action
        uses: svvsaga/github-actions-public/my-action@main
```

## Naming conventions

- Use dashes when-naming-your-action
- Use underscores when_naming_your_inputs_and_outputs
