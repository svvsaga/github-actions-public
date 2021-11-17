import { extractOperations } from '../apply-terraform-plan-from-gcs-implementation'

describe('extractOperations', () => {
  it('strips start and end of plan', () => {
    const releasedPlan = extractOperations(`
Note: Objects have changed outside of Terraform

Terraform detected the following changes made outside of Terraform since the
last "terraform apply":

  # google_bigquery_table.view has been changed
  ~ resource "google_bigquery_table" "view" ***
      ~ etag                = "d8Lr1ZQq0/H0CYG4Bp9q4g==" -> "spArPbAycKWECRWMDhFG+A=="
        id                  = "projects/my-project/datasets/consumer/tables/my_table"
      ~ last_modified_time  = 123 -> 456
        # (14 unchanged attributes hidden)

        # (1 unchanged block hidden)
    ***

Unless you have made equivalent changes to your configuration, or ignored the
relevant attributes using ignore_changes, the following plan may include
actions to undo or respond to these changes.

─────────────────────────────────────────────────────────────────────────────

No changes. Your infrastructure matches the configuration.

Your configuration already matches the changes detected above. If you'd like
to update the Terraform state to match, create and apply a refresh-only plan:
  terraform apply -refresh-only
`)

    const newPlan = extractOperations(`
No changes. Your infrastructure matches the configuration.

Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.

`)

    expect(newPlan).toEqual(releasedPlan)
  })
})
