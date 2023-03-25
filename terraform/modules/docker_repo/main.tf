variable "region" {
  type = string
}
variable "app_name" {
  type = string
}
variable "repo_id_suffix" {
  type = string
  default = "repo1"
}
variable "gcp_project_id" {
  type = string
}

resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.region
  repository_id = "${var.app_name}-${var.repo_id_suffix}"
  description   = "docker repository"
  format        = "docker"
}

# this complex path construct for image names is described here
# https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling
output "image_path_with_slash" {
  value = "${var.region}-docker.pkg.dev/${var.gcp_project_id}/${google_artifact_registry_repository.docker_repo.repository_id}/"
}
