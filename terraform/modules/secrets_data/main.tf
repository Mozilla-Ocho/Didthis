# these apis must be enabled
# - secretmanager

# these secrets must be created and populted manually before running terraform.

data "google_secret_manager_secret_version" "http_auth_pass" {
  secret  = "http_auth_pass"
}

output "http_auth_pass" {
  value = data.google_secret_manager_secret_version.http_auth_pass.secret_data
}

data "google_secret_manager_secret_version" "cloudinary_json" {
  secret  = "cloudinary_json"
}

output "cloudinary_json" {
  value = data.google_secret_manager_secret_version.cloudinary_json.secret_data
}

data "google_secret_manager_secret_version" "pocket_json" {
  secret  = "pocket_json"
}

output "pocket_json" {
  value = data.google_secret_manager_secret_version.pocket_json.secret_data
}

data "google_secret_manager_secret_version" "zyte_username" {
  secret  = "zyte_username"
}

output "zyte_username" {
  value = data.google_secret_manager_secret_version.zyte_username.secret_data
}

