these variables are used in terraform configuration. during project setup, you
should consider each one and set it appropriately in the `vars-prod.tfvars` or
`vars-nonprod.tfvars` files.

`autoscaling_min` and `autoscaling_max` are numbers that define the min and
max count of cloud run instances for cloud run's managed autoscaling feature.

`app_name` a top-level namespace for terraform resources and is used
heavily. stick to alphanumeric lowercase only. it's available as `APP_NAME` env
var inside containers.

note: this var is duplicated in env-dev file and in terraform vars.

`db_deletion_protection` if the db is enabled, this will prevent it from being
destroyed until this flag is turned off.

`db_tier` if the db is enabled, this is the instance tier, e.g "db-g1-small"

`env_name` is the github environment, aka "nonprod" or "prod" or "test" or
whatever. it's used to help name and identify resources, as well as provided
as the `ENV_NAME` environment var inside containers.

note: this var is duplicated in env-dev file and in terraform vars.

`flag_destroy` is boolean. set false to destroy all the resources associated
with this app (see `doc/teardown.md`)

`flag_use_db` is boolean, true to provision a database and related resources.
note that adding a database increases cost, and also on initial creation can
take up to 15 minutes to provision.

note: this var is duplicated in env-dev file and in terraform vars.

`flag_use_dummy_appserver` is a boolean. set this true on the first deployment,
then false once the docker repo has been provisioned.  when true, instead of
the actual appserver image, the cloud run appserver will be setup to use a
hello-world appserver from a public docker repo. without this, the first
deployment has a chicken or egg problem in which the appserver depends on a
custom image that can't be created because the private docker repository itself
doesn't exist.

`gcp_project_id` is a string containing the gcp project id.

note: this value is duplicated in the terraform vars and in the github
environment vars (as `GCP_PROJECT_ID`)

`gcp_project_number` is a string containing the project number. (it's a number
in practice but a string in these configs)

`region` contains the gcp region, e.g. "us-central-1" where all resources are
provisioned.

note: this value is duplicated in the terraform vars and in the github
environment vars (as `REGION`)

`vpc_remote_bucket` from your project's fork of
`boilerplate-project-vpcs` repo, the value of the prod or nonprod github
environment's `TF_VPCS_BACKEND_STATE_BUCKET` variable. in other words, the gcs
bucket in which the shared vpcs are defined.

note: this project's backend bucket name is not defined in
tfvars but in the github environment, as `TF_BACKEND_STATE_BUCKET`, because for
terraform use a variable in the backend config, it must be defined in the CLI
command in the github action. this probably has to do with differences between
terraform init (where the backend gets setup) vs plan/apply (where variables
are allowed.)

`vpc_remote_name` from your project's fork of the `boilerplate-project-vpcs`
repo, the name of the vpc to use. in other words, the name of the vpc among
the list defined in the other repo, e.g. `common`

