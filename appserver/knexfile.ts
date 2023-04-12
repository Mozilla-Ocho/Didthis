import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  client: "pg",
  connection: process.env.DATABASE_URL,
};

module.exports = config;
