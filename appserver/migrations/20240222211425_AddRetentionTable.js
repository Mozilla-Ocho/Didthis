/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('retention', function (table) {
    table.string('user_id').notNullable()
    table.date('date').notNullable()
    table.primary(['user_id','date'])
  })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('retention')
};
