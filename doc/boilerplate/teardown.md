# destroying the resources associated with an application

to delete everything provisioned in this boilerplate, for each environment
(prod/nonprod):

1. ensure `db_deletion_protection` is false. if not, set it true and deploy.
1. set `flag_destroy` to true and deploy. this will set terraform's `count`
   directive to zero for all the modules in the infrastructure, thereby
   deleting them.

note: the VPC and associated resources like VPC connectors, IP range
allocations, etc, managed in the `boilerplate-project-vpcs` fork, will not be
destroyed as they are managed there, not in this repo. this separation allows
applications to be spun up and destroyed independently of the set of vpcs that
contain them, and to allow multiple applications to co-habitate in the same
vpc.

also note: any GCP APIs enabled during provisioning will remain enabled.

