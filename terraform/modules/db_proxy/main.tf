# largely based on https://github.com/ryboe/private-ip-cloud-sql-db

variable "app_name" {
  type = string
}

variable "gcp_project_id" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "db_connection_name" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_user" {
  type = string
}

variable "db_pass" {
  type = string
}

resource "google_service_account" "account" {
  account_id  = "cloud-sql-proxy"
  description = "The service account used by Cloud SQL Proxy to connect to the db"
}

resource "google_project_iam_member" "role" {
  project = var.gcp_project_id
  role    = "roles/cloudsql.editor"
  member  = "serviceAccount:${google_service_account.account.email}"
}

resource "google_service_account_key" "key" {
  service_account_id = google_service_account.account.name
}

resource "google_compute_instance" "db_proxy" {
  name                      = "${var.app_name}-dbproxy"
  description               = <<-EOT
    A public-facing instance that proxies traffic to the database. This allows
    the db to only have a private IP address, but still be reachable from
    outside the VPC.
  EOT
  machine_type              = "f1-micro"
  allow_stopping_for_update = true

  tags = ["ssh-enabled"]

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
      size  = 10
      type  = "pd-ssd"
    }
  }

  metadata = {
    enable-oslogin = "TRUE"
  }

  metadata_startup_script = templatefile("${path.module}/run_cloud_sql_proxy.tpl", {
    "service_account_key" = google_service_account_key.key.private_key,
    "db_connection_name"  = var.db_connection_name,
    "db_name"             = var.db_name,
    "db_user"             = var.db_user,
    "db_pass"             = var.db_pass,
  })

  network_interface {
    network    = var.vpc_id
    access_config {}
  }

  scheduling {
    on_host_maintenance = "MIGRATE"
  }

  service_account {
    email = google_service_account.account.email
    scopes = ["cloud-platform"]
  }
}

output "public_ip" {
  description = "The public IP of the bastion instance running Cloud SQL Proxy"
  value       = google_compute_instance.db_proxy.network_interface.0.access_config.0.nat_ip
}
