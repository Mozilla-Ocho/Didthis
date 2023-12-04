// import profileUtils from './profileUtils'
import knex from '@/knex'
import { userFromDbRow } from './serverAuth'
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
  scope: ApiScope
  updatedat: number
}
const getProjects = async (
  page: number,
  limit: number
): Promise<GetProjectsResult> => {
  const projects: projList = []
  const users: userList = {}
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
  // console.log(projects)
  const userRows = await knex<UserDbRow>('users').whereIn(
    'id',
    Array.from(uids) as []
  )
  userRows.forEach(dbRow => {
    users[dbRow.id] = userFromDbRow(dbRow, { publicFilter: true })
  })
  return {
    // nextjs is somewhat bizarre and forces all data to lack explicit undefined
    // values with an error about not being able to serialize them.
    users: JSON.parse(JSON.stringify(users)) as userList,
    projects,
  }
}

type PostDbResult = {
  userid: ApiUserId
  projectid: ApiProjectId
  postid: ApiProjectId
  scope: ApiScope
  updatedat: number
}
type postList = PostDbResult[]
type GetPostsResult = {
  users: userList
  posts: postList
}
const getPosts = async (
  page: number,
  limit: number
): Promise<GetPostsResult> => {
  const posts: postList = []
  const users: userList = {}
  const uids = new Set()
  const postQuery = await knex.raw(
    `
    WITH users AS (
        SELECT
            id as userid,
            outer_k AS projectid,
            (outer_v->>'scope') scope,
            inner_k AS postid,
            (inner_v->>'updatedAt') updatedat
        FROM
            users,
            jsonb_each(profile->'projects') kv1(outer_k, outer_v),
            jsonb_each(outer_v->'posts') kv2(inner_k, inner_v)
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
  postQuery.rows.forEach((row: PostDbResult) => {
    uids.add(row.userid)
    posts.push(row)
  })
  // console.log(posts)
  const userRows = await knex<UserDbRow>('users').whereIn(
    'id',
    Array.from(uids) as []
  )
  userRows.forEach(dbRow => {
    users[dbRow.id] = userFromDbRow(dbRow, { publicFilter: true })
  })
  return {
    // nextjs is somewhat bizarre and forces all data to lack explicit undefined
    // values with an error about not being able to serialize them.
    users: JSON.parse(JSON.stringify(users)) as userList,
    posts,
  }
}

const getUsers = async (page: number, limit: number): Promise<ApiUser[]> => {
  const users: ApiUser[] = []
  const q = await knex('users')
    .orderByRaw("(profile->>'updatedAt')::BIGINT DESC")
    .limit(limit)
    .offset((page - 1) * limit)
  q.forEach((row:UserDbRow) => {
    users.push(userFromDbRow(row, { publicFilter: true }))
  })
  // get rid of undefined to appease weird nextjs strictness
  // console.log(users)
  return JSON.parse(JSON.stringify(users)) as ApiUser[]
}

type UserAdminOverview = ApiUser & {
  // this is public api user record plus the following fields specially added
  // for admin UI:
  email: string
  signupCodeName?: string
  numPublicProjects: number
  numPrivateProjects: number
  numPublicPosts: number
  numPrivatePosts: number
  lastPostedAt: number
  lastRead: number
  lastWrite: number
}
const getUserOverview = async (urlSlug: string): Promise<UserAdminOverview | false> => {
  const userRowPrivData = (await knex('users')
    .where('user_slug_lc', urlSlug.toLowerCase())
    .orWhere('system_slug', urlSlug)
    .first()) as UserDbRow | undefined
  // console.log("userRowPrivData",userRowPrivData)
  if (!userRowPrivData) {
    return false
  }
  const apiUserPubData = userFromDbRow(userRowPrivData, {publicFilter: true})
  let numPublicProjects = 0
  let numPublicPosts = 0
  let numPrivateProjects = 0
  let numPrivatePosts = 0
  let lastPostedAt = 0
  const lastRead = parseInt(userRowPrivData.last_read_from_user || '0', 10)
  const lastWrite = parseInt(userRowPrivData.last_write_from_user || '0', 10)
  // traverse all content incl private, for counts
  for (const projid in userRowPrivData.profile.projects) {
    const project = userRowPrivData.profile.projects[projid]
    const numPosts = Object.keys(project.posts).length
    for (const postid in project.posts) {
      lastPostedAt = Math.max(lastPostedAt, project.posts[postid].createdAt)
    }
    if (project.scope === 'public') {
      numPublicProjects++;
      numPublicPosts = numPublicPosts + numPosts
    } else {
      numPrivateProjects++;
      numPrivatePosts = numPrivatePosts + numPosts
    }
  }
  const overview: UserAdminOverview = {
    ...apiUserPubData,
    email: userRowPrivData.email,
    numPublicProjects,
    numPrivateProjects,
    numPublicPosts,
    numPrivatePosts,
    lastPostedAt,
    lastRead,
    lastWrite,
    signupCodeName: userRowPrivData.signup_code_name || undefined
  }
  return JSON.parse(JSON.stringify(overview)) as UserAdminOverview
}

const adminPages = {
  getProjects,
  getPosts,
  getUsers,
  getUserOverview,
}

export default adminPages
