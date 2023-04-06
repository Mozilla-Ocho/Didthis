TODO- flesh this out, this is an outline.

- getting gcp project and access from SRE, get id and number from gui
- enable some apis: the IAM API, what else?
- creating storage bucket (us, standard data, no public access, versioning
  enabled with 10 versions and 7d retention)
- creating the provisioner service account
  https://cloud.google.com/iam/docs/keys-create-delete
- fork repo
- in new repo on github:
  - creating environment
  - lock to a deployment branch
  - add secrets for gcp auth
    - `TF_PROVISIONER_SVC_ACCOUNT_KEY_JSON`
    - `TF_PROVISIONER_SVC_ACCOUNT_NAME`
  - add env vars `APP_NAME` `GCP_PROJECT_ID` `REGION` `TF_VARS_FILE` `TF_BACKEND_STATE_BUCKET`
- update vars files: app name, project data, turn on or off the db, etc.
- do first deploy to nonprod.
- note it takes ~15min to create the sql db instance the first time

