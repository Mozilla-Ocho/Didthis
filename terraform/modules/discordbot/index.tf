variable "app_name" {
  type = string
}
variable "env_name" {
  type = string
}
variable "svc_name" {
  type = string
}
variable "image_basename" {
  type = string
}
variable "image_path_with_slash" {
  type = string
}
variable "image_tag" {
  type = string
}
variable "region" {
  type = string
}
variable "vpc_id" {
  type = string
}
variable "vpc_access_connector_id" {
  type = string
}
variable "vpc_access_connector_name" {
  type = string
}
variable "graphql_api_url" {
  type = string
}

locals {
  full_name = "${var.app_name}-${var.env_name}-${var.svc_name}"
  common_env_var_defs = [
    {
      name  = "APP_NAME"
      value = var.app_name
    },
    {
      name  = "SVC_NAME"
      value = var.svc_name
    },
    {
      name  = "ENV_NAME"
      value = var.env_name
    },
    {
      name  = "IMAGE_TAG"
      value = var.image_tag
    },
    {
      name = "DISCORD_BOT_DIDTHIS_API_URL"
      value = var.graphql_api_url
    }
  ]
}

// see also: https://github.com/terraform-google-modules/terraform-google-container-vm/blob/master/examples/simple_instance/main.tf
module "discordbot-gce-container" {
  source  = "terraform-google-modules/container-vm/google"
  version = "~> 3.1"
  container = {
    image = "${var.image_path_with_slash}${var.image_basename}:${var.image_tag}"
    env = local.common_env_var_defs
  }
  restart_policy = "Always"
}

resource "google_compute_instance" "discordbot" {
  name = local.full_name
  // Include image_tag in description to force recreation of compute instance,
  // since the docker image won't get updated otherwise
  // see also: https://github.com/terraform-google-modules/terraform-google-container-vm/issues/29#issuecomment-1162639775
  // see also: https://cloud.google.com/blog/topics/developers-practitioners/force-terraform-resource-recreation
  // TODO: maybe try this trick to re-start the VM rather than recreate https://github.com/terraform-google-modules/terraform-google-container-vm/issues/29#issuecomment-988929879
  description = "Bot for sharing updates in Discord chat (${var.image_tag})"
  // TODO downgrade the VM instance to something cheaper? https://gcloud-compute.com/instances.html
  // machine_type = "f1-micro"
  // machine_type = "g1-small"
  machine_type = "e2-small"
  allow_stopping_for_update = true
  tags = ["ssh-enabled"]

  boot_disk {
    initialize_params {
      image = module.discordbot-gce-container.source_image
    }
  }

  network_interface {
    network    = var.vpc_id
    access_config {}
  }

  metadata = {
    gce-container-declaration = module.discordbot-gce-container.metadata_value
    google-logging-enabled    = "true"
    google-monitoring-enabled = "true"
    enable-oslogin = "TRUE"
  }

  labels = {
    container-vm = module.discordbot-gce-container.vm_container_label
  }

  scheduling {
    on_host_maintenance = "MIGRATE"
  }

  service_account {
    scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }
}

resource "google_cloud_run_v2_job" "deploy-slash-commands" {
  name = "${local.full_name}-deploy-slash-commands"
  location = var.region
  template {
    template {
      containers {
        image = "${var.image_path_with_slash}${var.image_basename}:${var.image_tag}"
        command = ["yarn","cli","deploy-slash-commands"]
        dynamic "env" {
          for_each = local.common_env_var_defs
          iterator = item
          content {
            name = item.value.name
            value = item.value.value
          }
        }
      }
      vpc_access {
        connector = var.vpc_access_connector_id
        egress = "ALL_TRAFFIC"
      }
    }
  }
}

output "service_name" {
  value = google_compute_instance.discordbot.name
}

output "image_deployed" {
  value = "${var.image_basename}:${var.image_tag}"
}
