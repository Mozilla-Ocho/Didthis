TODO- flesh this out, this is an outline.

- follow forking instructions in `doc/setup-forking.md` if you haven't yet
- creating storage bucket (us, standard data, no public access, versioning
  enabled with 10 versions and 7d retention)
- in both prod and nonprod projects, create a provisioner service account and
  get the json key value, https://cloud.google.com/iam/docs/keys-create-delete
- in new repo on github:
  - create environments prod/nonprod
  - in each:
    - lock to deployment branch releases/prod or releases/nonprod
    - add secrets for gcp auth
      - `TF_PROVISIONER_SVC_ACCOUNT_KEY_JSON` note you have to remove newlines
      - `TF_PROVISIONER_SVC_ACCOUNT_NAME`
   - add environment vars:
     - `TF_BACKEND_STATE_BUCKET` - set to the name of bucket in each prod/nonprod
       project you created above for terraform state.
     - these are duplicated in `terraform/vars-(prod|nonprod).tfvars` because they are needed in the github workflow context in addition to the terrform (see `doc/vars-files.md`)
       - `APP_NAME`
       - `REGION`
       - `GCP_PROJECT_ID`
       - `TF_VARS_FILE`
      - `DEPLOY_APPROVERS` a comma-separated list of github usernames who can approve deployments
- update values in `vars-nonprod.tfvars` and `vars-prod.tfvars` files, see `doc/vars-files.md`
- for the first deployment, `flag_use_dummy_appserver` must be set
  true, see `doc/var-files.md` for more info (chicken/egg problem with the
  docker repo on first deploy)
- commit do first deploy to nonprod by pushing or merging to `releases/nonprod`
- just before the final actions, deployments create a github issue that must be approved
- note it takes ~15min to create the sql db instance the first time if you have
  set `flag_use_db` to true

see `doc/teardown.md` for destroying the provisioned resources for a throwaway
application or environment.
