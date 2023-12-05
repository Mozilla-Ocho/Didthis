# see doc/vars-files.md
# do not put secrets here. see doc/secrets.md

app_name="REPLACEME"
autoscaling_max=5
autoscaling_min=2
db_deletion_protection=false
db_tier="db-g1-small"
env_name="nonprod"
flag_destroy=false
flag_use_db=false
flag_use_dummy_appserver=true
flag_use_firebase=false
gcp_project_id="REPLACEME"
gcp_project_number="REPLACEME"
region="us-central1"
vpc_remote_bucket="REPLACEME"
vpc_remote_name="common"
# change these when setting up a domain name per docs in the vpc repo:
flag_enable_lb=false
lb_ssl_domain_names=["test.example.com"]
lb_cert_domain_change_increment_outage=1
