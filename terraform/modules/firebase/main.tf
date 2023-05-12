/* creats a firebase project in the overall gcp project. it is only used for
 * auth, not firestore and so on, so we don't need to configure any of that.
 * however, turning on auth can't be done via terraform, it has to be done
 * manually via the GCP admin console for the firebase project.
 *
 * the firebase sdk running inside the cloud run appserver gets its credentials
 * automatically, so we don't have any special service accounts setup, though
 * we could create a dedicated service account for the cloud run appserver but
 * then we'd have to configure it to access all the resources.  that can be a
 * later TODO.
 *
 */

variable "gcp_project_id" {
  type = string
}
variable "app_name" {
  type = string
}

resource "google_firebase_project" "default" {
  # note that once enabled, firebase cannot be removed from a GCP project.
  provider = google-beta
  project  = var.gcp_project_id
}

resource "google_firebase_web_app" "firebase_web_app" {
  provider     = google-beta
  display_name = var.app_name
  depends_on = [google_firebase_project.default]
}

