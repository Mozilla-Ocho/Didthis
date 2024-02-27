/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // this migration pulls all the date info we have out of historical user
  // records and inserts records into the retention table for them (user
  // record creation, last update, last read, last write, profile post and
  // project creation and update timestamps.) the purpose of this is to be
  // able to compare retention metrics from older (web) users before the
  // retention table was launched, with the caveat that it does not reliably
  // capture read-only sessions (the last_read_from_user timestamp will, for
  // web app users, reflect their most recent session but sessions before that
  // are lost. for ios users, that value didn't get updated at all before the
  // retention table was launched so we really only have writes to go on.)
  const ymdFromMillis = millis => {
    // perhaps a value is not defined, return false
    if (!millis) return false
    const asInt = parseInt(millis, 10)
    if (!asInt) return false
    const [m, d, y] = new Date(asInt)
      .toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
      .split(',')[0]
      .split('/')
    const ymd = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
    return ymd
    return false
  }
  const users = await knex.select('*').from('users')
  for (const userRow of users) {
    const { profile } = userRow
    const dates = []
    const addMillis = millis => dates.push(ymdFromMillis(millis))
    addMillis(userRow.created_at_millis)
    addMillis(userRow.updated_at_millis)
    addMillis(userRow.last_write_from_user)
    addMillis(userRow.last_read_from_user)
    addMillis(profile.updatedAt)
    for (const [projId, project] of Object.entries(profile.projects)) {
      addMillis(project.createdAt)
      addMillis(project.updatedAt)
      for (const [postId, post] of Object.entries(project.posts)) {
        addMillis(post.createdAt)
        addMillis(post.updatedAt)
      }
    }
    // strip falsy values and dedupe
    const uniques = [...new Set(dates.filter(x => !!x))]
    // insert ignore into db retention table
    for (const ymd of uniques) {
      await knex.raw(
        `
        insert into retention (user_id,date) values (?,?) on conflict (user_id,date) do nothing
        `,
        [userRow.id, ymd]
      )
    }
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // in dev i was deleting all data from the table for testing. in nonprod and
  // prod we don't want that, rollback on this migration is impossible.
  // await knex.raw(`delete from retention`)
}
