#!/bin/bash
set -euo pipefail

# mostly from
# https://github.com/ryboe/private-ip-cloud-sql-db/blob/master/modules/dbproxy/run_cloud_sql_proxy.tpl

# JSW added base64 decode step, cloud_sql_proxy needs real json
echo '${service_account_key}' | base64 --decode >/var/svc_account_key.json
chmod 444 /var/svc_account_key.json

# JSW write our tf-generated random db pass to a file, along w/ username
echo '${db_name}' >/var/db_name
echo '${db_user}' >/var/db_user
echo '${db_pass}' >/var/db_pass

# JSW write a /var/connect.sh script that pulls the db vars in and creates the
# docker command to launch a psql client to the proxy server.  i can't figure
# out right now how to dump this bash script raw, without terraform template
# syntax causing interpolation and other issues with it.  therefore, i'm
# splatting it base64 encoded here and decoding it with a pipe. jeez.
echo "IyEvYmluL2Jhc2gKREJfTkFNRT1gY2F0IC92YXIvZGJfbmFtZWAKREJfVVNFUj1gY2F0IC92YXIvZGJfdXNlcmAKREJfUEFTUz1gY2F0IC92YXIvZGJfcGFzc2AKZG9ja2VyIHJ1biAtLXJtIC0tbmV0d29yaz1ob3N0IC1pdCAtZSBQR1BBU1NXT1JEPSIkREJfUEFTUyIgcG9zdGdyZXM6MTMtYWxwaW5lIHBzcWwgLVUgJERCX1VTRVIgLWggbG9jYWxob3N0IC1kICREQl9OQU1FCg==" | base64 --decode >/var/connect.sh

docker pull gcr.io/cloudsql-docker/gce-proxy:latest

docker run --rm -p 127.0.0.1:5432:3306 -v /var/svc_account_key.json:/key.json:ro gcr.io/cloudsql-docker/gce-proxy:latest /cloud_sql_proxy -credential_file=/key.json -ip_address_types=PRIVATE -instances=${db_connection_name}=tcp:0.0.0.0:3306
