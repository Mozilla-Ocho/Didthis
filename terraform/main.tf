variable "app_name" { type = string }
variable "autoscaling_max" { type = number }
variable "autoscaling_min" { type = number }
variable "db_deletion_protection" { type = bool }
variable "db_tier" { type = string }
variable "env_name" { type = string }
variable "flag_use_firebase" { type = bool }
variable "flag_destroy" { type = bool }
variable "flag_use_db" { type = bool }
variable "flag_use_dummy_appserver" { type = bool }
variable "gcp_project_id" { type = string }
variable "gcp_project_number" { type = string }
variable "region" { type = string }
variable "vpc_remote_bucket" { type = string }
variable "vpc_remote_name" { type = string }

variable "image_tag" {
  # this var is not defined in the vars file, it's passed in at runtime via the
  # CLI in the github action job because it changes for each run.
  type = string
}

terraform {
  required_version = ">= 0.14"
  required_providers {
    google = "~> 4.33"
  }
  backend "gcs" {
    # note that a bucket value is required here but is passed in from the
    # terraform init step via a command line argument.
    prefix  = "terraform/state/app"
  }
}

provider "google" {
  project = var.gcp_project_id
  region = var.region
  zone    = "us-central1-b"
}

data "terraform_remote_state" "remote_vpcs" {
  backend = "gcs"
  config = {
    bucket = var.vpc_remote_bucket
    prefix = "terraform/state/vpcs"
  }
}

locals {
  # get shorthand for the specific vpc id, access connector id, and access
  # connectore name for the vpc we're using from the set of available vpcs
  # in the remote.
  vpc_id = data.terraform_remote_state.remote_vpcs.outputs.ids[var.vpc_remote_name]
  vpc_access_connector_id = data.terraform_remote_state.remote_vpcs.outputs.connector_ids[var.vpc_remote_name]
  vpc_access_connector_name = data.terraform_remote_state.remote_vpcs.outputs.connector_names[var.vpc_remote_name]
}

module "gcp_apis" {
  # note that deleting the gcp_apis resources has no real effect because they
  # are set to disable_on_destroy=false, it could wreak havoc on a gcp project
  # for a single application in the project to go around deleting these global
  # api enablements. in this case, flag_destroy will really just remove them
  # from terraform state.
  count = var.flag_destroy ? 0 : 1
  source = "./modules/gcp_apis"
}

module "db" {
  count = var.flag_destroy ? 0 : var.flag_use_db ? 1 : 0
  source = "./modules/db"
  name = "${var.app_name}-pgmain"
  db_name = "graceland" # TODO: this needs to be based on app-name
  db_tier = var.db_tier
  region = var.region
  vpc_id = local.vpc_id
  db_deletion_protection = var.db_deletion_protection
  depends_on = [module.gcp_apis]
}

module "bastion" {
  count = var.flag_destroy ? 0 : 1
  source = "./modules/bastion"
  app_name  = var.app_name
  gcp_project_id = var.gcp_project_id
  vpc_id = local.vpc_id
  db_host = var.flag_use_db ? module.db[0].private_ip_address : ""
  db_name = var.flag_use_db ? module.db[0].db_name : ""
  db_user = var.flag_use_db ? module.db[0].db_user : ""
  db_pass = var.flag_use_db ? module.db[0].db_pass : ""
  depends_on = [module.gcp_apis]
}

module "docker_repo" {
  count = var.flag_destroy ? 0 : 1
  source = "./modules/docker_repo"
  region = var.region
  gcp_project_id = var.gcp_project_id
  app_name = var.app_name
  depends_on = [module.gcp_apis]
}

module "firebase" {
  count = var.flag_use_firebase ? 1 : 0
  source = "./modules/firebase"
  gcp_project_id = var.gcp_project_id
  app_name = var.app_name
  depends_on = [module.gcp_apis]
}

module "appserver_main" {
  count = var.flag_destroy ? 0 : 1
  source = "./modules/gcr_appserver"
  app_name = var.app_name
  env_name = var.env_name
  svc_name = "appserver"
  flag_use_db = var.flag_use_db
  flag_use_dummy_appserver = var.flag_use_dummy_appserver
  image_basename = "appserver"
  image_tag = var.image_tag
  image_path_with_slash = module.docker_repo[0].image_path_with_slash
  region = var.region
  db_host = var.flag_use_db ? module.db[0].private_ip_address : ""
  db_name = var.flag_use_db ? module.db[0].db_name : ""
  db_user = var.flag_use_db ? module.db[0].db_user : ""
  db_pass = var.flag_use_db ? module.db[0].db_pass : ""
  vpc_access_connector_id = local.vpc_access_connector_id
  vpc_access_connector_name = local.vpc_access_connector_name
  autoscaling_min = var.autoscaling_min
  autoscaling_max = var.autoscaling_max
  depends_on = [
    module.gcp_apis,
    module.docker_repo[0],
    module.db[0]
  ]
}

module "lb_main" {
  count = var.flag_destroy ? 0 : var.flag_enable_lb ? 1 : 0
  source = "./modules/lb"
  app_name = var.app_name
  name = "main"
  region = var.region
  gcr_service_name = module.appserver_main[0].service_name
  lb_ssl_domain_names = var.lb_ssl_domain_names
  lb_cert_domain_change_increment_outage = var.lb_cert_domain_change_increment_outage
  depends_on = [module.gcp_apis, module.appserver_main[0]]
}

output "gcr_service_url" {
  value = var.flag_destroy ? "" : module.appserver_main[0].service_url
}

output "gcr_image_deployed" {
  value = var.flag_destroy ? "" : module.appserver_main[0].image_deployed
}

output "public_lb_ip_address" {
  value = var.flag_destroy ? "" : var.flag_enable_lb ? module.lb_main.public_lb_ip_address : "(lb not enabled)"
}

# output "dns_records_lb" {
#   value = module.lb_main.dns_records
# }

