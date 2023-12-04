exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.string('id').primary()
    table.string('email').notNullable()
    // system_slug is generated at user creation and is basically a public,
    // url-friendly ID for a user (unlike the the actual id column which is
    // from firebase.). user_slug is selected by the user, optionally.
    // system_slug and user_slug are both usable as slugs so user lookups by
    // slug have to check both columns. uniqueness across both columns is
    // enforced at the application level for now by checking before writing.
    // TODO: move these to a slugs table that is many to one with users and has
    // a single, unqiue constrained index. also put timestamps on there so we
    // can then allow old user slugs to still for work and redirect permanently
    // for some period after users change them and so forth.
    table.string('system_slug').notNullable()
    table.string('user_slug')
    table.jsonb('profile').notNullable()
    table.bigInteger('created_at_millis').notNullable()
    table.bigInteger('updated_at_millis').notNullable()
    table.string('signup_code_name')
    table.string('admin_status')
    table.string('ban_status')
    table.jsonb('admin_meta')
    table.bigInteger('last_write_from_user')
    table.bigInteger('last_read_from_user')
    // add unique constraint indices:
    table.unique(['email'])
    table.unique(['system_slug'])
    table.unique(['user_slug'])
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
