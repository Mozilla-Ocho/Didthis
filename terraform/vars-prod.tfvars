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
flag_use_firebase=true
gcp_project_id="moz-fx-future-products-prod"
gcp_project_number="29393258446"
region="us-central1"
vpc_remote_bucket="tfstate-vpcs-07b5b6988f2f"
vpc_remote_name="common"
# change these when setting up a domain name per docs in the vpc repo:
flag_enable_lb=false
lb_ssl_domain_names=["didthis.app","www.didthis.app"]
lb_cert_domain_change_increment_outage=5
graphql_api_url="https://didthis.app/api/graphql"
