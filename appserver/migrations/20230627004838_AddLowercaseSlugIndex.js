/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('users', function (table) {
    table.string('user_slug_lc')
    table.unique(['user_slug_lc'])
    knex.raw("UPDATE users SET user_slug_lc = LOWER(user_slug);").then(() => console.log('Success'))
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('user_slug_lc')
  })
}
