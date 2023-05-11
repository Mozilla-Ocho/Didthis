exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.string('id').primary();
    table.string('email').notNullable();
    table.string('url_slug');
    table.jsonb('profile').notNullable();
    table.bigInteger('created_at_millis').notNullable();
    table.bigInteger('updated_at_millis').notNullable();
    table.string('signup_code_name');
    table.string('admin_status')
    table.string('ban_status')
    table.jsonb('admin_meta')
    table.bigInteger('last_write_from_user');
    table.bigInteger('last_read_from_user');
    // add unique constraint indices:
    table.unique(['email']);
    table.unique(['url_slug']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};

