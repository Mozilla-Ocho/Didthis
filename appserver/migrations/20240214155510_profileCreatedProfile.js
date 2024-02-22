exports.up = async function (knex) {
  const users = await knex.select('*').from('users')
  for (const userRow of users) {
    const { id, profile } = userRow

    let createdPlatform = "web"
    if (/^appleid-/.test(id)) {
      createdPlatform = "native-ios"
    }

    if (typeof profile.createdPlatform === "undefined") {
      profile.createdPlatform = createdPlatform
    }

    for (const projId in profile.projects) {
      const project = profile.projects[projId]
      if (typeof project.createdPlatform === "undefined") {
        project.createdPlatform = createdPlatform
      }

      for (const postId in profile.projects[projId].posts) {
        const post = project.posts[postId]
        if (typeof post.createdPlatform === "undefined") {
          post.createdPlatform = createdPlatform
        }
      }
    }
    await knex('users').update({ profile }).where('id', id)
  }
}

exports.down = async function (knex) {
  const users = await knex.select('*').from('users')
  for (const userRow of users) {
    const { id, profile } = userRow
    delete profile.createdPlatform
    for (const projId in profile.projects) {
      const project = profile.projects[projId]
      delete project.createdPlatform
      for (const postId in profile.projects[projId].posts) {
        const post = project.posts[postId]
        delete post.createdPlatform
      }
    }
    await knex('users').update({ profile }).where('id', id)
  }
}
