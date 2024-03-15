variable "app_name" {
  type = string
}

variable "gcp_project_id" {
  type = string
}

variable "vpc_id" {
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

variable "db_host" {
  type = string
}

resource "google_compute_instance" "bastion" {
  name                      = "${var.app_name}-bastion"
  description               = <<-EOT
    Bastion host primarily for DB access for devs/admins.
  EOT
  machine_type              = "f1-micro"
  allow_stopping_for_update = true

  tags = ["ssh-enabled"]

  boot_disk {
    initialize_params {
      image = "ubuntu-2204-lts"
      size  = 10
      type  = "pd-ssd"
    }
  }

  metadata = {
    enable-oslogin = "TRUE"
  }

  metadata_startup_script = templatefile("${path.module}/setup.tpl", {
    "db_name"             = var.db_name,
    "db_user"             = var.db_user,
    "db_pass"             = var.db_pass,
    "db_host"             = var.db_host,
  })

  network_interface {
    network    = var.vpc_id
    # access_config {}
  }

  scheduling {
    on_host_maintenance = "MIGRATE"
  }

}

