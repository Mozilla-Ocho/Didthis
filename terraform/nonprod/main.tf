variable "app_name" {
  type = string
}
variable "image_tag" {
  type = string
}
variable "region" {
  type = string
}
variable "gcp_project_id" {
  type = string
}
variable "gcp_project_number" {
  # this is still a string
  type = string
}
variable "flag_use_dummy_appserver" {
  # set true when first standing up the terraform resources
  type = bool
}
variable "autoscaling_min" {
  type = number
}
variable "autoscaling_max" {
  type = number
}
variable "db_deletion_protection" {
  type = bool
}
variable "db_tier" {
  type = string
}
variable "flag_use_db" {
  type = bool
}

terraform {
  required_version = ">= 0.14"
  required_providers {
    google = "~> 4.33"
  }
  backend "gcs" {
    # note that a bucket value is required here and is passed in from the
    # github action terraform init step via a command line argument.
    prefix  = "terraform/state"
  }
}

provider "google" {
  project = var.gcp_project_id
  region = var.region
  zone    = "us-central1-b"
}

module "gcp_apis" {
  source = "../modules/gcp_apis"
}

module "vpc" {
  source = "../modules/vpc"
  app_name = var.app_name
  region = var.region
  gcp_project_id = var.gcp_project_id
  gcp_project_number = var.gcp_project_number
  depends_on = [module.gcp_apis]
}

module "db" {
  # XXX add to initial docs that this can take ~15min to create the first time
  count = var.flag_use_db ? 1 : 0
  source = "../modules/db"
  db_name = "${var.app_name}-pgmain"
  db_tier = var.db_tier
  region = var.region
  vpc_id = module.vpc.vpc_id
  db_deletion_protection = var.db_deletion_protection
  depends_on = [module.vpc, module.gcp_apis]
}

module "db_proxy" {
  count = var.flag_use_db ? 1 : 0
  source = "../modules/db_proxy"
  app_name  = var.app_name
  gcp_project_id = var.gcp_project_id
  vpc_id = module.vpc.vpc_id
  db_connection_name = module.db[0].connection_name
  db_user = module.db[0].db_user
  db_name = module.db[0].db_name
  db_pass = module.db[0].db_pass
  depends_on = [module.gcp_apis]
}

module "docker_repo" {
  source = "../modules/docker_repo"
  region = var.region
  gcp_project_id = var.gcp_project_id
  app_name = var.app_name
  depends_on = [module.gcp_apis]
}

# module "firebase" {
#   source = "../modules/firebase"
#   gcp_project_id = var.gcp_project_id
#   depends_on = [module.gcp_apis]
# }

module "appserver_main" {
  source = "../modules/gcr_appserver"
  app_name = var.app_name
  name = "appserver-main"
  flag_use_db = var.flag_use_db
  flag_use_dummy_appserver = var.flag_use_dummy_appserver
  image_basename = "appserver"
  image_tag = var.image_tag
  image_path_with_slash = module.docker_repo.image_path_with_slash
  region = var.region
  db_host = var.flag_use_db ? module.db[0].private_ip_address : ""
  db_name = var.flag_use_db ? module.db[0].db_name : ""
  db_user = var.flag_use_db ? module.db[0].db_user : ""
  db_pass = var.flag_use_db ? module.db[0].db_pass : ""
  vpc_access_connector_name = module.vpc.vpc_access_connector_name
  autoscaling_min = var.autoscaling_min
  autoscaling_max = var.autoscaling_max
  depends_on = [
    module.gcp_apis,
    module.docker_repo,
    module.db[0],
    module.vpc
  ]
}

# module "lb_main" {
#   source = "../modules/lb"
#   prefix = var.app_name
#   name = "main"
#   region = var.region
#   gcr_service_name = module.appserver_main.service_name
#   domains = var.domains
#   lb_cert_domain_change_increment_outage = var.lb_cert_domain_change_increment_outage
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

output "db_proxy_public_ip" {
  value = var.flag_use_db ? module.db_proxy[0].public_ip : "none"
}


