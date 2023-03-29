dev setup: see dedicated `dev-setup.md`

gcp setup: see dedicated `gcp-setup.md`

initializing the prod db 
- do first deploy
- run db migration first time via gcr job
- run db seed

migrating prod db
- run db migration job for the correct environment from gcp console

migration strategy overall:
- backwards compatible migration
  - write code that uses a new schema in a feature branch.
  - merge the migration only, but not the feature, to main and deploy it.
  - run the migration job.
  - then merge the feature code that uses it and deploy it.
- breaking change migration (needs maintenance mode which we don't have yet)
  - write code that uses a new schema in a feature branch.
  - put app into maintenance mode (TODO)
  - merge, deploy feature branch
  - run migration job
  - come out of maintenance mode



