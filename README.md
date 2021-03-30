# GitHub Actions

Useful GitHub Actions

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
