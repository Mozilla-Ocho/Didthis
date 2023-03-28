# the following apis must be enabled
# - vpcaccess
# - servicenetworking

# NOTE ON DELETION:
# XXX discuss this in a teardown doc
# there is currently a bug in gcp that prevents deletion of a vpc when dangling
# resources from cloud run or other services are not totally cleaned up, which
# is beyond my control. so don't be surprised if terraform fails to delete the
# vpc as the final step. in this case, i just remove it from terraform state
# and ensure that the next vpc i create has a different identifier.
# https://issuetracker.google.com/issues/186792016?pli=1
# terraform state rm module.vpc.google_compute_network.vpc

variable "region" {
  type = string
}

variable "app_name" {
  type = string
}

variable "gcp_project_id" {
  type = string
}

variable "gcp_project_number" {
  type = string
}

locals {
  vpc_name = "vpc-${var.app_name}"
}

# {{{ vpc itself

resource "google_compute_network" "vpc" {
  name                    = local.vpc_name
  auto_create_subnetworks = "true"
}

output "vpc_id" {
  value = google_compute_network.vpc.id
}

# }}}

# {{{ cloud run instances egress through the vpc (see
# "run.googleapis.com/vpc-access-egress" = "all-traffic" in the cloud run
# service annotations) so we need nat in the vpc so that they can access the
# internet. added this initially for supporting the url meta fetching feature
# but it will be needed for any external api/service integration originating
# from cloud run instances.

resource "google_compute_router" "router" {
  name    = "${local.vpc_name}-nat-router"
  region  = var.region
  network = google_compute_network.vpc.id
}

resource "google_compute_router_nat" "nat" {
  name                               = "${local.vpc_name}-nat"
  router                             = google_compute_router.router.name
  region                             = google_compute_router.router.region
  // we could allocate a static ip or be more specific here, but we don't care,
  // we are not talking to resources through the nat that require firewall
  // rules or such, mostly just making outbound http requests from the
  // appserver to the internet.
  nat_ip_allocate_option             = "AUTO_ONLY"
  // having any/all subnetworks and ip ranges allowed to use nat is fine for
  // now since there are currently no cases in the vpc where we don't want
  // that. if we did, we'd have to define specific subnets and allocate
  // resources accordingly.
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

# }}}
#
# {{{ vpc connection to db

resource "google_compute_global_address" "private_ip_alloc" {
  # i'm not sure if this should be called "google-managed-services-default" but
  # it is what is used in the tutorial. is this a special value? other examples
  # of this sort of setup use a name like "private-ip-alloc" or similar.
  name          = "priv-ip-alloc-${local.vpc_name}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 20 # 16 vs 20 does it matter?
  network       = google_compute_network.vpc.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_alloc.name]
}

# }}}

# {{{ connecting from cloud run -> vpc -> sql

# according to
# https://codelabs.developers.google.com/connecting-to-private-cloudsql-from-cloud-run#3
# we need to "Add the Cloud SQL Client role to Compute Engine service account" as part
# of getting cloud run and cloud sql inside a vpc working.
resource "google_project_iam_member" "sqlclient_role_for_compute_svc_account" {
  # (note: be careful with iam assignments through terraform, there's stuff
  # predefined in the project that we are not managing and could overwrite,
  # that could break things or even lock out the project. the
  # "google_project_iam_member" resource is safe as it is additive and won't
  # overwrite/replace anything already existing.)
  project = var.gcp_project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${var.gcp_project_number}-compute@developer.gserviceaccount.com"
}

# https://codelabs.developers.google.com/connecting-to-private-cloudsql-from-cloud-run#4
resource "google_vpc_access_connector" "connector" {
  # to be used in the cloud run service's annotations
  name          = "${local.vpc_name}-con"
  ip_cidr_range = "10.8.0.0/28"
  # note that the gcp guide on connecting cloud run to cloud sql in a vpc sets
  # up using the default vpc network but we have created one and are using that.
  # so the value here is not "default" but the custom vpc id
  network       = google_compute_network.vpc.id
  region        = var.region
}

output "vpc_access_connector_id" {
  value = google_vpc_access_connector.connector.id
}

output "vpc_access_connector_name" {
  value = google_vpc_access_connector.connector.name
}

# }}}

# {{{ open firewall to ssh for resources tagged ssh-enabled (db proxy)
# see doc/db_proxy.md

resource "google_compute_firewall" "allow_ssh" {
  name        = "${local.vpc_name}-allow-ssh"
  description = "Allow SSH traffic to any instance tagged with 'ssh-enabled'"
  network     = google_compute_network.vpc.id
  direction   = "INGRESS"
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["ssh-enabled"]
}

# }}}

