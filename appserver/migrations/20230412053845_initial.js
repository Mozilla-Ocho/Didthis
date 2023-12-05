exports.up = function (knex) {
  return knex.schema.createTable("dummy_records", function (table) {
    table.string("id").primary();
    table.string("value").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("dummy_records");
};
