# connecting to nonprod/prod dbs through the bastion host

## TLDR

On your dev box:
```
gcloud auth login
gcloud compute os-login ssh-keys add --key-file=MYPUBRSAKEYFILE.pub --ttl=1d
gcloud config set project PROJECTNAME # eg moz-fx-future-products-nonprod
gcloud compute instances list # find zone and name of bastion host
gcloud compute ssh --tunnel-through-iap --zone=ZONE INSTANCENAME # eg us-central1-b h3y-bastion
# and now in the host:
psql $PG_CONNECT_URI
```

It's critical that your ssh key ABSOLUTELY MUST have a strong passphrase or you
risk a total data breach if your key is stolen.

And always be aware of what gcp project you're in (nonprod/prod), when setting
the value it can be easy to forget. You can always find out with `gcloud config list`

## problem + solution overview

problem: the db is in a vpc, with no public access. the appserver running in
cloud run has access, but it's a serverless environment that we can't get a
shell on. how do we run psql client against the prob/nonprod db and run
administrative queries?

solution:
- in each environment (prod and nonprod), create a bastion host inside the vpc.
- it does not need a public IP, as we'll use IAP tunneling to access it. this
  is much more secure than exposing its ssh server publicly (and in fact
  required by Mozilla SRE team)
- poke a hole for ssh tunneling (ONLY from the IAP service IP block, per
  Mozilla policy) to this host in the firewall: add a vpc firewall rule to open
  TCP 22 for the CIDR block of IAP for all vpc resources tagged 'ssh-enaboled',
  and then tag the compute instance 'ssh-enabled'.
- use the os-login framework from gcp to manage access to it so that devs can
  register their ssh keys with the service and then ssh to the box (through an
  IAP tunnel) after authenticating with their local gcloud client. this way we
  do not have to worry about installing ssh keys directly on the bastion host,
  can programmatically inspect/manage who has access, etc.
- during setup, add the psql client on this host and an environment variable
  with the necessary connection data.

the bastion host is created automatically in the boilerplate, even if
`flag_use_db` is false.  if there's no db, there just won't be a meaningful
`$PG_CONNECT_URI` environment variable.

## accessing the db, detailed explanation

1. if not already installed, install the gcloud cli: https://cloud.google.com/sdk/docs/install-sdk
1. in a shell:
1. `gcloud auth login` (if you haven't done so already)
1. identify the public rsa key of the key you wish to use for ssh, for example `~/.ssh/id_rsa_mozilla.pub`.  *This key must have a very strong passphrase. No exceptions!*
1. (Re-)add your ssh key to the os-login framework. We are using a short ttl on the key for added security in case a developer's keys are compromised. This is production, real human user private data we're talking about here. It's simple to run this and re-add it as needed.  `gcloud compute os-login ssh-keys add --key-file=FILEFROMABOVE --ttl=1d`
1. identify the name of the project whose database you want to connect to, for example `mox-fx-future-products-nonprod`
1. set this as the default project for cli commands: `gcloud config set project VALUE`
1. find the zone of the bastion host. `gcloud compute instances list` there may be more than one, be sure you've identified the correct one, it will look like `someappname-bastion` 
1. connect to the bastion host via ssh: `gcloud compute ssh --tunnel-through-iap --zone=ZONE NAME` substituting ZONE and NAME from the values in the instance list above.
1. the host has psql client and an environment var with the necessary connection data, you just run `psql $PG_CONNECT_URI` and you should be in.

