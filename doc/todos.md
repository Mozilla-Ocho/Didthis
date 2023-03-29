- db proxy needs local util script to find the IP addr and connect the right
  way
- switch to workload identity federation, more secure and controllable than
  long-lived service account credentials
- reduce privileges of service account to editor
- deployment locking per-environment
- have pull-based deployments instead of pushes, involving review and ideally a
  terraform plan to look at
- setup a way to run terraform locally when needed since sometimes you have to
  hand-hold it (like when importing resources, or deleting resources from state
  that were removed externally already.)
- could reduce the initial setup effort by scriping the gcloud CLI
- for apps with custom dns we may need a separate project w/ remote refs to
  handle per-app subdomains on a shared prototyping domain.
- ssl certs on the lb create an outage when you change them, switch to
  a smoother certificate verification approach.
