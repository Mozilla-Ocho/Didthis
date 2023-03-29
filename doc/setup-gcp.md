
TODO things to cover:
- getting gcp project id and number
- creating storage bucket
- creating service account
- github:
  - creating environment
  - lock to a deployment branch
  - add secrets for gcp auth
    - `TF_PROVISIONER_SVC_ACCOUNT_KEY_JSON`
    - `TF_PROVISIONER_SVC_ACCOUNT_NAME`
  - add env var `TF_VARS_FILE`
  - add env var `TF_BACKEND_STATE_BUCKET`
- first deploy
- note it takes ~15min to create the sql db instance the first time
