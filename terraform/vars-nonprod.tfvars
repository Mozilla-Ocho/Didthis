# see doc/vars-files.md
# do not put secrets here. see doc/secrets.md

app_name="h3y"
autoscaling_max=5
autoscaling_min=2
db_deletion_protection=false
db_tier="db-g1-small"
env_name="nonprod"
flag_destroy=false
flag_use_db=true
flag_use_dummy_appserver=false
flag_use_firebase=true
gcp_project_id="moz-fx-future-products-nonprod"
gcp_project_number="984891837435"
region="us-central1"
vpc_remote_bucket="tfstate-vpcs-5ec7945d96f"
vpc_remote_name="common"
# change these when setting up a domain name per docs in the vpc repo:
flag_enable_lb=true
lb_ssl_domain_names=["test.didthis.app","www.test.didthis.app"]
lb_cert_domain_change_increment_outage=5
graphql_api_url="https://test.didthis.app/api/graphql"
