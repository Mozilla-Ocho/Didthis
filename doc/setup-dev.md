# setting up dev environment

- install docker on your dev box if you haven't yet.
- clone the repo
- in repo root, run `docker compose up -d`
- migrate and seed the local dev postgres db:
  - get a shell in the appserver container: `docker compose exec appserver bash`
  - in this shell: `yarn knex migrate:latest`
  - and also: `yarn knex seed:run`
  - exit with `exit`
- note these useful docker commands:
  - `docker compose up -d` - start, or update, as needed, the running services.
  - `docker compose down` - stop services
  - `docker compose build` - happens automatically with up, but useful when testing changes to docker file
