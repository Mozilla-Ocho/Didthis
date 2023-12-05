/* creats a firebase project in the overall gcp project. it is only used for
 * auth, not firestore and so on, so we don't need to configure any of that.
 *
 * note that the user database is per-GCP project, not per deployed
 * application. this is important for several reasons:
 *
 *   - there will be existing users in the auth db when an app is launched, so
 *   auth code must not assume every authenticated used already exists, and
 *   must auto-vivify users it hasn't seen yet.
 *
 *   - since user accounts are shared across each app, so are user passwords.
 *   this is going to be super confusing for end users, if they are expecting
 *   to use each prototype/app separately. this is one good reason to abandon
 *   firebase, however, it's probable that this doesn't matter in practice for
 *   early MVPs and tests, it is a survivable point of friction.
 *
 * also, turning on auth can't be done via terraform, it has to be done
 * manually via the admin console for the firebase project. note it's a
 * difference endpoint from the regular GCP admin console. it's at
 * https://console.firebase.google.com/
 *
 * the firebase sdk running inside the cloud run appserver gets its secret
 * credentials automatically, so we don't have any special service accounts
 * setup, though we could create a dedicated service account for the cloud run
 * appserver but then we'd have to configure it to access all the resources.
 * that can be a later TODO. however, the app api key and other configs (which
 * are publicly shared in client code) still must be setup. and for dev, there
 * is a credentials file needed (see doc/setup-firebase.md)
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


