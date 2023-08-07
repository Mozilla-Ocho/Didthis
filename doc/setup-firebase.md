## adding firebase to a project for auth

- update `vars-(prod|nonprod).tfvars` and set `flag_use_firebase=true`
- deploy, to provision the firebase app
- in GCP console, manually enable auth for the firebase app (can't be done programmatically)
- generate a set of credentials to be used in local dev (when running on cloud
  run in GCP, firebase sdk can get credentials from the local environment) and
  save this in `appserver/.firebase-dev-credentials.json`

