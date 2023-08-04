exports.up = async function (knex) {
  const users = await knex.select('*').from('users')
  for (const userRow of users) {
    profile = userRow.profile
    for (const projId in profile.projects) {
      for (const postId in profile.projects[projId].posts) {
        post = profile.projects[projId].posts[postId]
        post.didThisAt = post.createdAt
      }
    }
    await knex('users')
      .update({
        profile,
      })
      .where('id', userRow.id)
  }
}

exports.down = async function (knex) {
  const users = await knex.select('*').from('users')
  for (const userRow of users) {
    profile = userRow.profile
    for (const projId in profile.projects) {
      for (const postId in profile.projects[projId].posts) {
        post = profile.projects[projId].posts[postId]
        delete post.didThisAt
      }
    }
    await knex('users')
      .update({
        profile,
      })
      .where('id', userRow.id)
  }
}
