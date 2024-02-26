exports.up = async function (knex) {
  // this is a second pass on backfilling the profile metadata at the top
  // profile level which adds 'authMethod'. the 'createdPlatform' attribute was
  // already backfilled, but the deployed code after the backfill wasn't
  // populating the value for new signups until now, so i'm backfilling that
  // again to patch the gap.
  const users = await knex.select('*').from('users')
  for (const userRow of users) {
    const { id, profile } = userRow
    let createdPlatform = "web"
    let authMethod = "email"
    if (/^appleid-/.test(id)) {
      createdPlatform = "native-ios"
      authMethod = "apple"
    }
    if (/^trial-/.test(id)) {
      createdPlatform = "web"
      authMethod = "trial"
    }
    if (typeof profile.createdPlatform === "undefined") {
      profile.createdPlatform = createdPlatform
    }
    if (typeof profile.authMethod === "undefined") {
      profile.authMethod = authMethod
    }
    await knex('users').update({ profile }).where('id', id)
  }
}

exports.down = async function (knex) {
  const users = await knex.select('*').from('users')
  for (const userRow of users) {
    const { id, profile } = userRow
    delete profile.createdPlatform
    delete profile.authMethod
    await knex('users').update({ profile }).where('id', id)
  }
}
