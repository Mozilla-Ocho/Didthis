#!/bin/bash
set -euo pipefail

# install psql client
apt-get install -y postgresql-client-14

# not sure we need this but often is needed on ubuntu
ufw allow ssh
ufw enable

# create a local env var for all users containing the db connect uri.
# so that you can ssh in, then just run 'psql $PG_CONNECT_URI' to get a connection.
echo 'PG_CONNECT_URI="postgresql://${db_user}:${db_pass}@${db_host}/${db_name}"' >> /etc/environment

