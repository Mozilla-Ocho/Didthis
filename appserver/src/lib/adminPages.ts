// import profileUtils from './profileUtils'
import knex from '@/knex'
import {userFromDbRow} from './serverAuth'
// import log from '@/lib/log'

type projList = [ApiUserId, ApiProjectId][]
type userList = { [key: ApiUserId]: ApiUser }
type GetProjectsResult = {
  users: userList
  projects: projList
}
type projDbResult = {
  userid: ApiUserId
  projectid: ApiProjectId
  updatedat: number
}
const getProjects = async (page: number, limit: number): Promise<GetProjectsResult> => {
  const projects: projList = []
  const users:userList = {}
  const uids = new Set()
  const projQuery = await knex.raw(
    `
    WITH users AS (
        SELECT
            id as userid,
            outer_k AS projectid,
            (outer_v->>'updatedAt') updatedat,
            (outer_v->>'scope') scope
        FROM
            users,
            jsonb_each(profile->'projects') kv1(outer_k, outer_v)
    )
    SELECT
        *
    FROM
        users
    WHERE
        scope = 'public'
    ORDER BY
        updatedat DESC
    OFFSET ?
    LIMIT ?
    `,
    [(page - 1) * limit, limit]
  )
  projQuery.rows.forEach((row: projDbResult) => {
    uids.add(row.userid)
    projects.push([row.userid, row.projectid])
  })
  console.log(projects)
  const userRows = await knex<UserDbRow>('users')
    .whereIn('id', Array.from(uids) as [])
  userRows.forEach(dbRow => {
    users[dbRow.id] = userFromDbRow(dbRow, { publicFilter: true })
  })
  return {
    // nextjs is somewhat bizarre and forces all data to lack explicit undefined
    // values with an error about not being able to serialize them.
    users: JSON.parse(JSON.stringify(users)) as userList,
    projects
  }
}

const adminPages = {
  getProjects,
}

export default adminPages
