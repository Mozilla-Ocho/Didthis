/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(
      `update users set profile = jsonb_set(
        profile,
        '{"updatedAt"}',
        to_jsonb(EXTRACT(EPOCH FROM NOW())::BIGINT * 1000), true);
      `)
    .then(() => console.log('success'))
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(
      `update users set profile = profile - 'updatedAt'`)
    .then(() => console.log('success'))
}
