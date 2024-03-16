resource "google_project_service" "run_api" {
  service = "run.googleapis.com"
  disable_on_destroy = false
}

output "run_api" {
  value = google_project_service.run_api.id
}

resource "google_project_service" "cloudbuild_api" {
  service = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}

output "cloudbuild_api" {
  value = google_project_service.cloudbuild_api.id
}

resource "google_project_service" "artifactregistry_api" {
  service = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

output "artifactregistry_api" {
  value = google_project_service.artifactregistry_api.id
}

resource "google_project_service" "compute_api" {
  service = "compute.googleapis.com"
  disable_on_destroy = false
}

output "compute_api" {
  value = google_project_service.compute_api.id
}

resource "google_project_service" "sqladmin" {
  service = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

output "sqladmin" {
  value = google_project_service.sqladmin.id
}

resource "google_project_service" "servicenetworking" {
  service = "servicenetworking.googleapis.com"
  disable_on_destroy = false
}

output "servicenetworking" {
  value = google_project_service.servicenetworking.id
}

resource "google_project_service" "vpcaccess" {
  service = "vpcaccess.googleapis.com"
  disable_on_destroy = false
}

output "vpcaccess" {
  value = google_project_service.vpcaccess.id
}

resource "google_project_service" "secretmanager" {
  service = "secretmanager.googleapis.com"
  disable_on_destroy = false
}

output "secretmanager" {
  value = google_project_service.secretmanager.id
}

resource "google_project_service" "dns" {
  service = "dns.googleapis.com"
  disable_on_destroy = false
}

output "dns" {
  value = google_project_service.dns.id
}

resource "google_project_service" "certificatemanager" {
  service = "certificatemanager.googleapis.com"
  disable_on_destroy = false
}

output "certificatemanager" {
  value = google_project_service.certificatemanager.id
}

resource "google_project_service" "cloudresourcemanager" {
  service = "cloudresourcemanager.googleapis.com"
  disable_on_destroy = false
}

output "cloudresourcemanager" {
  value = google_project_service.cloudresourcemanager.id
}

resource "google_project_service" "iam" {
  service = "iam.googleapis.com"
  disable_on_destroy = false
}

output "iam" {
  value = google_project_service.iam.id
}

resource "google_project_service" "iamcredentials" {
  service = "iamcredentials.googleapis.com"
  disable_on_destroy = false
}

output "iamcredentials" {
  value = google_project_service.iamcredentials.id
}

resource "google_project_service" "oslogon" {
  service = "oslogin.googleapis.com"
  disable_on_destroy = false
}

output "oslogin" {
  value = google_project_service.oslogon.id
}

resource "google_project_service" "firebase" {
  service    = "firebase.googleapis.com"
  disable_on_destroy = false
}

output "firebase" {
  value = google_project_service.firebase.id
}

resource "google_project_service" "iap" {
  service    = "iap.googleapis.com"
  disable_on_destroy = false
}

output "iap" {
  value = google_project_service.iap.id
}

