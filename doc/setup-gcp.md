TODO- flesh this out, this is an outline.

- if you haven't yet for your gcp project, fork boilerplate-project-vpcs and
  configure one or more vpc(s) in your prod/nonprod pair.
- creating storage bucket (us, standard data, no public access, versioning
  enabled with 10 versions and 7d retention)
- in both prod and nonprod projects, create a provisioner service account and
  get the json key value, https://cloud.google.com/iam/docs/keys-create-delete
- fork the repo
- in new repo on github:
  - create environments prod/nonprod
  - in each:
    - lock to deployment branch releases/prod or releases/nonprod
    - add secrets for gcp auth
      - `TF_PROVISIONER_SVC_ACCOUNT_KEY_JSON` note you have to remove newlines
      - `TF_PROVISIONER_SVC_ACCOUNT_NAME`
   - add vars `APP_NAME` `REGION` `GCP_PROJECT_ID` `TF_VARS_FILE` `TF_BACKEND_STATE_BUCKET`
- update vars files: app name, project data, turn on or off the db, etc.
- do first deploy to nonprod.
- note it takes ~15min to create the sql db instance the first time

see `doc/teardown.md` for destroying the provisioned resources for a throwaway
application or environment.
