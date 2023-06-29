# see doc/vars-files.md
# do not put secrets here. see doc/secrets.md

app_name="h3y"
autoscaling_max=5
autoscaling_min=2
db_deletion_protection=false
db_tier="db-g1-small"
env_name="prod"
flag_destroy=false
flag_use_db=true
flag_use_dummy_appserver=false
gcp_project_id="moz-fx-future-products-prod"
gcp_project_number="29393258446"
region="us-central1"
vpc_remote_bucket="tfstate-vpcs-07b5b6988f2f"
vpc_remote_name="common"
# when changing domains on the load balancer cert, the
# lb_cert_domain_change_increment_outage must be incremented which will cause a
# temporary outage while the load balancer cert is being provisioned.
# TODO: zero-downtime changes to domain names / certs...
lb_ssl_domain_names=["didthat.com","www.didthat.com"]
lb_cert_domain_change_increment_outage=1

