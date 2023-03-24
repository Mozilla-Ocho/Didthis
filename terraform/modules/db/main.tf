# the following services must be enabled
# - compute_api
# - sqladmin,

# NOTE ON DELETION:
# XXX add this to a teardown howto
# destroying a provisioned db module fails because terraform tries to remove
# the google_sql_user before deleting the db instance, but GCP sees the user is
# tied to resources in the db itself. there is no fix in terraform for this, we
# just have to manually remove the db and user from terraform state so that
# terraform doesn't try to destroy it, they will go away when the db instance
# is destroyed.
# terraform state rm module.db.google_sql_user.dbuser
# terraform state rm module.db.google_sql_database.db

variable "db_name" {
  type = string
}
variable "db_tier" {
  default = "db-g1-small"
  type = string
}
variable "region" {
  type = string
}
variable "vpc_id" {
  type = string
}
variable "db_deletion_protection" {
  # XXX add this to a teardown howto (need to set false first)
  default = true
  type = string
}

# {{{ db password
# we generate and manage it in terraform state, and provide it to appserver
# via env var definitions.

resource "random_password" "maindbpass" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# }}}

# {{{ actual db

resource "google_sql_database_instance" "main" {
  name             = var.db_name
  database_version = "POSTGRES_14" # XXX i changed from 12 to 14 here - update appserver cli version
  region           = var.region

  settings {
    tier = var.db_tier
    ip_configuration {
      ipv4_enabled    = false # no public ip, vpc only
      private_network = var.vpc_id
    }
    backup_configuration {
      enabled = true
      point_in_time_recovery_enabled = true
    }
  }

  deletion_protection = var.db_deletion_protection

  timeouts {
    create = "20m"
    delete = "20m"
  }
}

output "private_ip_address" {
  value = google_sql_database_instance.main.private_ip_address
}

# was having trouble with setting up the google_sql_user, at least
# one person online had the problem and fixed it w/ a delay before
# creating that user, however the fix was to not specify host (see
# google_sql_user below)
# resource "time_sleep" "wait_before_creating_user" {
#   create_duration = "300s" # 5 minutes
#   depends_on = [google_sql_database_instance.main]
# }

resource "google_sql_database" "db" {
  name      = "graceland"
  instance  = google_sql_database_instance.main.name
}

resource "google_sql_user" "dbuser" {
  name     = "appuser"
  instance = google_sql_database_instance.main.name
  # specifying host causes this to fail
  # https://github.com/hashicorp/terraform-provider-google/issues/11365
  # host     = "%"
  password = random_password.maindbpass.result
  # depends_on = [time_sleep.wait_before_creating_user]
}

output "db_user" {
  value = google_sql_user.dbuser.name
}
output "db_pass" {
  value = google_sql_user.dbuser.password
}
output "db_name" {
  value = google_sql_database.db.name
}
output "connection_name" {
  # e.g. my-project:us-central1:my-db
  # used for the sql proxy on the jump host
  value = google_sql_database_instance.main.connection_name
}

# }}}
