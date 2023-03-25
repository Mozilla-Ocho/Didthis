# XXX i can move a number of these values into github secrets and then pass
# them into as args.  this way the boilerplate can remain generic, and the
# github secrets define the particulars.
#
# as in:
# env:
#  BUCKET_TF_STATE: ${{ secrets.BUCKET_TF_STATE}}
# then can do
# terraform init -backend-config="bucket=$BUCKET_TF_STATE"
# per https://spacelift.io/blog/github-actions-terraform

variable "image_tag" {
  type = string
}

# XXX move this to separate file for easier version control / merges
locals {
  region = "us-central1"
  app_name = "boilertest1" # XXX must be unique within a gcp project to avoid collision, must work as a subdomain (alphanumeric and dashes, no spaces or underscores)
  autoscaling_min = 2 # avoid slow starts
  autoscaling_max = 5 # avoid cost explosions
  gcp_project_id = "moz-fx-future-products-nonprod" # XXX
  gcp_project_number = "984891837435" # XXX
  db_tier = "db-g1-small"
  db_deletion_protection = false
  use_dummy_appserver = false # set true when first standing up the terraform resources
  lb_cert_domain_change_increment_outage = 1 # bump when domains in the ssl certificate change, THIS CAUSES AN OUTAGE XXX
} 

terraform {
  required_version = ">= 0.14"
  required_providers {
    google = "~> 4.33"
  }
  backend "gcs" {
    # XXX must be globally unique, and unique for the app, and must be created in advance
    # XXX document creation config: us, standard data, no public access, versioning enabled with 10 versions and 7d retention
    bucket  = "tfstate-x92n3dj12-boilertest1"
    prefix  = "terraform/state"
  }
}

provider "google" {
  project = local.gcp_project_id
  region = local.region
  zone    = "us-central1-b"
}

module "gcp_apis" {
  source = "../modules/gcp_apis"
}

module "vpc" {
  source = "../modules/vpc"
  app_name = local.app_name
  region = local.region
  gcp_project_id = local.gcp_project_id
  gcp_project_number = local.gcp_project_number
  depends_on = [module.gcp_apis]
}

# module "db" {
#   source = "../modules/db"
#   db_name = "${local.app_name}-pgmain"
#   region = local.region
#   vpc_id = module.vpc.vpc_id
#   depends_on = [module.vpc, module.gcp_apis]
# }

# module "db_proxy" {
#   source = "../modules/db_proxy"
#   app_name  = local.app_name
#   gcp_project_id = local.gcp_project_id
#   vpc_id = module.vpc.vpc_id
#   db_connection_name = module.db.connection_name
#   db_user = module.db.db_user
#   db_name = module.db.db_name
#   db_pass = module.db.db_pass
#   depends_on = [module.gcp_apis]
# }

module "docker_repo" {
  source = "../modules/docker_repo"
  region = local.region
  gcp_project_id = local.gcp_project_id
  app_name = local.app_name
  depends_on = [module.gcp_apis]
}

# module "firebase" {
#   source = "../modules/firebase"
#   gcp_project_id = local.gcp_project_id
#   depends_on = [module.gcp_apis]
# }

module "appserver_main" {
  source = "../modules/gcr_appserver"
  app_name = local.app_name
  name = "appserver-main"
  use_dummy_appserver = local.use_dummy_appserver
  image_basename = "appserver"
  image_tag = var.image_tag
  image_path_with_slash = module.docker_repo.image_path_with_slash
  region = local.region

  # db_host = module.db.private_ip_address
  # db_name = module.db.db_name
  # db_user = module.db.db_user
  # db_pass = module.db.db_pass
  vpc_access_connector_name = module.vpc.vpc_access_connector_name
  autoscaling_min = local.autoscaling_min
  autoscaling_max = local.autoscaling_max
  depends_on = [
    module.gcp_apis,
    module.docker_repo,
    # module.db,
    module.vpc
  ]
}

# module "lb_main" {
#   source = "../modules/lb"
#   prefix = local.app_name
#   name = "main"
#   region = local.region
#   gcr_service_name = module.appserver_main.service_name
#   domains = local.domains
#   lb_cert_domain_change_increment_outage = local.lb_cert_domain_change_increment_outage
#   depends_on = [module.gcp_apis, module.appserver_main]
# }

output "gcr_service_url" {
  value = module.appserver_main.service_url
}

output "gcr_image_deployed" {
  value = module.appserver_main.image_deployed
}

# output "public_ip_address" {
#   value = module.lb_main.public_ip_address
# }

# output "dns_records_lb" {
#   value = module.lb_main.dns_records
# }

# output "db_proxy_public_ip" {
#   value = module.db_proxy.public_ip
# }


