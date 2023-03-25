# needs artifactregistry_api

variable "region" {
  type = string
}
variable "repository_id" {
  type = string
}
variable "gcp_project_id" {
  type = string
}

# docker repo on artifact registry
resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.region
  repository_id = var.repository_id
  description   = "docker repository"
  format        = "docker"
}

output "image_path_with_slash" {
  # DRY_r4703 docker repo name and paths
  value = "${var.region}-docker.pkg.dev/${var.gcp_project_id}/${google_artifact_registry_repository.docker_repo.repository_id}/"
}
