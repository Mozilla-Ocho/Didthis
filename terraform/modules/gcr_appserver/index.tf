variable "name" {
  type = string
}
variable "app_name" {
  type = string
}
locals {
  full_name = "${var.app_name}-${var.name}"
}

variable "use_dummy_appserver" {
  # if true, full_image_name is not used and instead a dummy hello world
  # appserver is installed instead.
  type = bool
}
variable "image_basename" {
  # e.g. appserver
  type = string
}
variable "image_path_with_slash" {
  # e.g. us-east1-docker.pkg.dev/my-project/my-repo/
  # must include trailing slash
  type = string
}
variable "image_tag" {
  # e.g. the 7-char git short sha
  type = string
}
variable "region" {
  type = string
}
variable "db_host" {
  default = ""
  type = string
}
variable "db_name" {
  default = ""
  type = string
}
variable "db_user" {
  default = ""
  type = string
}
variable "db_pass" {
  default = ""
  type = string
}
variable "autoscaling_min" {
  default = 1
  type = number
}
variable "autoscaling_max" {
  default = 2
  type = number
}
variable "vpc_access_connector_name" {
  type = string
}

resource "google_cloud_run_service" "appserver" {
  name = local.full_name
  location = var.region

  # sometimes during carefully managed deployments, we don't want terraform to
  # actually replace the appserver even if it wants to, due to some change like
  # an updated environment var, so this little block can be temporarily used
  # to suppress terraform changes:
  # lifecycle {
  #   ignore_changes = [template]
  # }

  template {
    spec {
      containers {
        image = var.use_dummy_appserver ? "us-docker.pkg.dev/cloudrun/container/hello:latest" : "${var.image_path_with_slash}${var.image_basename}:${var.image_tag}"
        env {
          name  = "IMAGE_TAG"
          value = var.image_tag
        }
        env {
          name  = "DB_HOST"
          value = var.db_host
        }
        env {
          name = "DB_NAME"
          value = var.db_name
        }
        env {
          name = "DB_USER"
          value = var.db_user
        }
        env {
          name = "DB_PASS"
          value = var.db_pass
        }
      }
    }
    metadata {
      # this name should match that in revision_name below
      name = var.use_dummy_appserver ? "${local.full_name}-hello" : "${local.full_name}-${var.image_tag}"
      # annotations can be found here
      # https://cloud.google.com/run/docs/reference/rest/v1/RevisionTemplate
      annotations = {
        "autoscaling.knative.dev/minScale" = var.autoscaling_min
        "autoscaling.knative.dev/maxScale" = var.autoscaling_max
        "run.googleapis.com/vpc-access-connector" = var.vpc_access_connector_name
        # also see
        # https://cloud.google.com/run/docs/configuring/connecting-vpc
        # if this is set to "private-ranges-only", the cloud run appserver
        # cannot reach our sql instance, it must be "all-traffic".
        "run.googleapis.com/vpc-access-egress" = "all-traffic"
      }
    }
  }

  traffic {
    percent       = 100
    revision_name = var.use_dummy_appserver ? "${local.full_name}-hello" : "${local.full_name}-${var.image_tag}"
  }

  timeouts {
    create = "5m"
    update = "5m"
    delete = "5m"
  }
}

# open internet access to service
resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.appserver.name
  location = google_cloud_run_service.appserver.location
  role     = "roles/run.invoker"
  member   = "allUsers"
  depends_on = [google_cloud_run_service.appserver]
}

output "service_name" {
  value = google_cloud_run_service.appserver.name
}
output "service_url" {
  value = google_cloud_run_service.appserver.status[0].url
}
output "image_deployed" {
  value = var.use_dummy_appserver ? "${local.full_name}-hello" : "${var.image_basename}:${var.image_tag}"
}
