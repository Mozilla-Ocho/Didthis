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
variable "gcp_project_id" {
  type = string
}

variable "media_storage_location" { default = "us" }

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
      name = "EXPORTER_DIDTHIS_API_URL"
      value = var.graphql_api_url
    },
    {
      name = "GCP_PROJECT_ID"
      value = var.gcp_project_id
    }
  ]
}

resource "google_storage_bucket" "media_storage" {
  name          = "${local.full_name}-exports-storage"
  location      = var.media_storage_location
  force_destroy = true

  cors {
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 300
  }
}

// Should be using signed URLs for this, but this will make the bucket public for debugging
// see: https://cloud.google.com/storage/docs/access-control/making-data-public#buckets
/*
resource "google_storage_bucket_iam_member" "member" {
  bucket = google_storage_bucket.media_storage.name
  role     = "roles/storage.objectViewer"
  member   = "allUsers"
}
*/

resource "google_compute_backend_bucket" "media_storage" {
  name        = "${local.full_name}-exports-storage-backend"
  description = "Contains user content exports"
  bucket_name = google_storage_bucket.media_storage.name
  enable_cdn  = false
}


resource "google_cloud_run_v2_job" "perform-content-export" {
  name = "${local.full_name}-perform-content-export"
  location = var.region
  template {
    template {
      containers {
        image = "${var.image_path_with_slash}${var.image_basename}:${var.image_tag}"
        resources {
          limits = {
            cpu    = "2"
            // Temporary files live in RAM, so we may need to tune this
            // based on the expected size of exports
            // https://cloud.google.com/appengine/docs/standard/using-temp-files?tab=python
            // https://cloud.google.com/functions/docs/bestpractices/tips#always_delete_temporary_files
            // https://cloud.google.com/run/docs/configuring/services/memory-limits
            memory = "8Gi"
          }
        }
        command = ["yarn","cli","export"]
        env {
          name = "GCP_PROJECT_ID"
          value = var.gcp_project_id
        }
        env {
          name = "GCP_EXPORTS_STORAGE_BUCKET_NAME"
          value = google_storage_bucket.media_storage.name
        }
        env {
          name = "GCP_EXPORTS_STORAGE_BUCKET_URL"
          value = google_storage_bucket.media_storage.url
        }
        env {
          name = "GCP_EXPORTS_STORAGE_BUCKET_SELF_LINK"
          value = google_storage_bucket.media_storage.self_link
        }
        env {
          name = "GCP_EXPORTS_STORAGE_BUCKET_LOCATION"
          value = var.media_storage_location
        }
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

output "media_storage" {
  value = google_storage_bucket.media_storage
}

output "export_job_id" {
  value = google_cloud_run_v2_job.perform-content-export.id
}
