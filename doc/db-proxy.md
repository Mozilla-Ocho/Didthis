# the database proxy solution

problem: the db is in a vpc, with no public access. the appserver running in
cloud run has access, but it's a serverless environment that we can't get a
shell on. how do we run psql client against the prob/nonprod db and run
administrative queries?

solution:
- create a bastion host inside the vpc with a public ip.
- use the login os framework from gcp to manage access to it so that devs can
  register their ssh keys with the service and then ssh to the box after
  authenticating with their local gcloud client. this way we do not have to
  worry about installing ssh keys directly on the bastion host, can
  programmatically inspect/manage who has access, etc.
- install and launch on this host the cloud sql proxy docker image provided by
  google which proxies the actual cloud sql instance's connection to a
  localhost port.
- also install on this host some scripting to connect to that local port
  with the right credentials (db user, name, pwd) using the psql binary on a
  postgres docker image.
- connect to that host using a special docker container we build locally that
  has the developer's ssh key (installing it into login os registry), a script
  to figure out where/how to connect to the instance, and to invoke a series of
  commands across these multiple hosts that eventually leads to a psql console.

# how to use it

locally, build a dbproxy-cli image local to your machine that has your personal
ssh key in it. **the ssh key you use must have a strong passphrase, it protects
production user data.**

    # change id_rsa[.pub] here to your preferred ssh key for accessing the
    # proxy instance. the public key will be uploaded to the google os login
    # service, the private key will be copied into the image's filesystem.
    ./util.sh build-dbproxy-cli ~/.ssh/id_rsa ~/.ssh/id_rsa.pub

run this exceedingly complex magical command to get a db shell:

    ./util.sh dbproxy-cli <--prod|--nonprod>

which launches a dbproxy-cli docker image and then runs
`./dbproxy_cli_connect.sh`, which auths to gcp, obtains your username for os
login from gcloud, obtains the ip address of the proxy intance from terraform
outputs, opens an ssh connection to that instance, and then on that instance
runs the `/var/connect.sh` script (see
`terraform/modules/db_proxy/run_cloud_sql_proxy.tpl`)

# in more detail

the `db_proxy` module in terraform defines a google compute instance inside the
vpc that has permissions (via IAM) to access the sql db, and the os login
framework for login. a hole is opened in the firewall for the vpc (in the `vpc`
module) for port 22 on any instance with the `ssh-enabled` tag. using a startup
script, it creates some local files in `/var` that are needed for
authentication, as well as the `/var/connect.sh` one-liner script, and launches
the cloud sql proxy server in a docker container.

the `dbproxy-cli` docker image, locally, is used for providing a consistent
baseline for accessing this instance. it must be created with an ssh key that
will be associated with your google account in the os login framework, so the
`util.sh` command to build it requires the pub and priv key filenames.
`util.sh` provides a command `dbproxy-cli` which launches this container, and
from it runs the `dbproxy_cli_connect.sh` script.

`dbproxy_cli_connect.sh` gets you authed to gcp, adds the ssh key to os login,
finds out your os login username, gets the ip address of the proxy instance,
and then connects to it via ssh, invoking the `/var/connect.sh` script finally.

