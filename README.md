# GitHub Actions

Useful GitHub Actions!

## Publishing new versions

We follow semantic versioning when publishing new versions.

A new version will automatically be published when a push or PR merge is done with a commit msg tag.

1. If any commit in the push has a commit message containing `#major`, a major version will be published.
1. If any commit in the push has a commit message containing `#minor`, a minor version will be published.
1. If any commit in the push has a commit message containing `#patch`, a patch version will be published.
1. Otherwise, no new tag is created.

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

## GCP Authentication

Many of our modules depend on Google Cloud Platform. We recommend using [Workload Identity Federation](https://cloud.google.com/blog/products/identity-security/enabling-keyless-authentication-from-github-actions) to authenticate with GCP, because this is more secure than long-lived JSON keys. Follow the link above to set this up for your project.

We also support using service account keys for backwards compatibility.

**NOTE: `gsutil` does not yet support WIF, so for workflows that use `gsutil` directly or indirectly, authentication with service account key is necessary.**
