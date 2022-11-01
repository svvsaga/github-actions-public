# GitHub Actions

![Latest version](https://img.shields.io/github/v/tag/svvsaga/github-actions-public?label=Latest)

Useful GitHub Actions!

<!-- filetree -->

 - **apply-terraform-plan-from-artifact/**
   - [Readme](./apply-terraform-plan-from-artifact/README.md)
 - **apply-terraform-plan-from-gcs/**
   - [Readme](./apply-terraform-plan-from-gcs/README.md)
 - **bump-semver-tag/**
   - [Readme](./bump-semver-tag/README.md)
 - **find-gradle-module-changes/**
   - [Readme](./find-gradle-module-changes/README.md)
 - **find-module-changes/**
   - [Readme](./find-module-changes/README.md)
 - **find-severity-of-push/**
   - [Readme](./find-severity-of-push/README.md)
 - **find-terraform-changes/**
   - [Readme](./find-terraform-changes/README.md)
 - **install-tfmask/**
   - [Readme](./install-tfmask/README.md)
 - **post-issue-to-card/**
   - [Readme](./post-issue-to-card/README.md)
 - **publish-terraform-plan-as-artifact/**
   - [Readme](./publish-terraform-plan-as-artifact/README.md)
 - **publish-terraform-plan-to-gcs/**
   - [Readme](./publish-terraform-plan-to-gcs/README.md)
 - **read-integration-testing-config/**
   - [Readme](./read-integration-testing-config/README.md)
 - **read-project-config/**
   - [Readme](./read-project-config/README.md)
 - **read-terraform-dependencies/**
   - [Readme](./read-terraform-dependencies/README.md)
 - **read-terraform-pr-config/**
   - [Readme](./read-terraform-pr-config/README.md)
 - **replace-tfvars-with-secrets/**
   - [Readme](./replace-tfvars-with-secrets/README.md)
 - **set-github-app-token/**
   - [Readme](./set-github-app-token/README.md)
 - **setup-gcloud/**
   - [Readme](./setup-gcloud/README.md)
 - **setup-gcloud-with-json-key/**
   - [Readme](./setup-gcloud-with-json-key/README.md)
 - **setup-gcloud-with-workload-identity/**
   - [Readme](./setup-gcloud-with-workload-identity/README.md)
 - **show-terraform-plan-on-pr/**
   - [Readme](./show-terraform-plan-on-pr/README.md)
 - **tag-semantic-version/**
   - [Readme](./tag-semantic-version/README.md)

<!-- filetreestop -->

## Use actions

In your workflow from another repo:

```yaml
jobs:
  build:
    steps:
      - name: My Action
        uses: svvsaga/github-actions-public/my-action@v17.1.2
```

## Publishing new versions

We follow semantic versioning when publishing new versions.

A new version will automatically be published when a push or PR merge is done with a commit msg tag.

1. If any commit in the push has a commit message containing `#major`, a major version will be published.
1. If any commit in the push has a commit message containing `#minor`, a minor version will be published.
1. If any commit in the push has a commit message containing `#patch`, a patch version will be published.
1. Otherwise, no new tag is created.

## Add new actions

- Make a file in `src`, e.g. `src/my-action.ts`
- Add optional implementation details or utils in their respective subfolders
- Make a folder `my-action`
- Add a `action.yml` file to that folder

## Naming conventions

- Use dashes when-naming-your-action
- Use underscores when_naming_your_inputs_and_outputs

## GCP Authentication

Many of our modules depend on Google Cloud Platform. We recommend using [Workload Identity Federation](https://cloud.google.com/blog/products/identity-security/enabling-keyless-authentication-from-github-actions) to authenticate with GCP, because this is more secure than long-lived JSON keys. Follow the link above to set this up for your project.

We also support using service account keys for backwards compatibility.

**NOTE: `gsutil` does not yet support WIF, so for workflows that use `gsutil` directly or indirectly, authentication with service account key is necessary.**
