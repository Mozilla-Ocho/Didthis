const emails = [
  'jwhiting+didthat@mozilla.com',
  'slangtonhood+didthat1@mozilla.com',
]

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('users')
    .update({
      admin_status: 'admin',
    })
    .whereIn('email', emails)
    .then(() => console.log('success'))
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('users')
    .update({
      admin_status: null,
    })
    .whereIn('email', emails)
    .then(() => console.log('success'))
}
