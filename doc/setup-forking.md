# forking the boilerplate

these steps are needed when forking the boilerplate:

1. git the fork a name suitable to your application
1. in order to deploy in GCP, you'll need to first have VPCs setup. there is a separate repo to fork and configure for that, you only need to do that once. see `Ocho/boilerplate-project-vpcs` and configure one or more vpc(s) in your prod/nonprod GCP project pair.
1. re-eanble workflows, it gets disabled by default on forks, in the "actions" tab
1. in repo settings, enable issues, they are used to approve deployments.

next is to do `doc/setup-dev.md` for local dev and `doc/setup-gcp.md` for setting up a hosted application.
