these variables are used in terraform configuration:

`app_name` a top-level namespace for terraform resources and is used
heavily. stick to alphanumeric lowercase only. it's available as `APP_NAME` env
var inside containers.

todo: this var is duplicated in env-dev file

`env_name` is the github environment, aka "nonprod" or "prod" or "test" or
whatever. it's used to help name and identify resources, as well as provided
as the `ENV_NAME` environment var inside containers.

todo: this var is duplicated in env-dev file

`gcp_project_id` is a string containing the gcp project id.

`gcp_project_number` is a string containing the project number.

`region` contains the gcp region, e.g. "us-central-1" where all resources are
provisioned.

`flag_use_dummy_appserver` is a boolean. when true, instead of the actual
appserver image, the cloud run appserver will be setup to use a hello-world
appserver. this can be used if initially the real code wouldn't work due
to other dependent services or configurations that aren't ready yet.

`autoscaling_min` and `autoscaling_max` are numbers that define the min and
max count of cloud run instances for cloud run's managed autoscaling feature.

`flag_use_db` is boolean, true to provision a database and related resources.
note that adding a database increases cost, and also on initial creation can
take up to 15 minutes to provision.

todo: this var is duplicated in env-dev file

`db_deletion_protection` if the db is enabled, this will prevent it from being
destroyed until this flag is turned off.

`db_tier` if the db is enabled, this is the instance tier, e.g "db-g1-small"

note the backend bucket name (`TF_BACKEND_STATE_BUCKET`) is not defined here
but in the github environment, because for some reason, terraform can't handle
using a variable in the backend config, it must be defined in the CLI command
in the github action. this probably has to do with differences between
terraform init (where the backend gets setup) vs plan/apply (where variables
are allowed.)

also note the `image_tag` (the shortened git sha) is not defined in the vars
file, it's generated in the github action also, because it changes for each
run.

TODO
- setup such that a react build step can get per-environment vars, similar to
  how it will need per-env secrets (third party api keys etc)

