import { YogaInitialContext } from 'graphql-yoga'
import type { NextApiRequest, NextApiResponse } from 'next'
import { GraphQLError, GraphQLFieldResolver } from 'graphql'
import knex from '@/knex'
import { cloudinaryUrlDirect } from '@/lib/cloudinaryConfig'
import { userFromDbRow } from '@/lib/serverAuth'
import { resolvers as scalarResolvers } from 'graphql-scalars'

export type CustomContext = {
  req: NextApiRequest
  res: NextApiResponse
  baseUrl: URL
  parentUser: ApiUser
}

export type FieldResolver<TSource, TArgs> = GraphQLFieldResolver<
  TSource,
  CustomContext & YogaInitialContext,
  TArgs
>
export type RootQueryFieldResolver<TArgs> = FieldResolver<undefined, TArgs>
export type LeafFieldResolver<TSource> = FieldResolver<TSource, undefined>

export const queryUser: RootQueryFieldResolver<{
  id: string
  slug: string
}> = async (obj, args, context, info) => {
  const { id, slug } = args
  context.baseUrl = getBaseUrlFromRequest(context.req)

  if (!id && !slug) {
    throw new GraphQLError(`User lookup requires id or slug`)
  }

  let dbRow: UserDbRow | undefined
  if (id) {
    dbRow = await knex('users').where('id', id).first()
  } else {
    dbRow = await knex('users')
      .where('user_slug_lc', slug.toLowerCase())
      .orWhere('system_slug', slug)
      .first()
  }
  if (!dbRow) return null

  const user = userFromApiUser(
    context.baseUrl,
    userFromDbRow(dbRow, { publicFilter: true })
  )
  context.parentUser = user
  return user
}

export const queryPublicUpdates: RootQueryFieldResolver<{
  since: number
  until: number
  limit: number
  requireDiscordAccount: boolean
  requireAutoShare: boolean
}> = async (obj, args, context, info) => {
  const since = new Date(args.since)
  const until = new Date(args.until) || new Date()
  const limit = args.limit || 10
  const requireDiscordAccount = args.requireDiscordAccount || false
  const requireAutoShare = args.requireAutoShare || false

  context.baseUrl = getBaseUrlFromRequest(context.req)

  const userRows = (await knex('users')
    .where('updated_at_millis', '>', since.getTime())
    // HACK: This limit assumes that each user will have at least 1 update worth grabbing
    .limit(limit)) as UserDbRow[]

  // HACK: fake a stream of updates across users & projects
  const updates = []
  for (const userRow of userRows) {
    const user = userFromApiUser(
      context.baseUrl,
      userFromDbRow(userRow, { publicFilter: true })
    )

    for (const project of Object.values(user.profile.projects)) {
      if (project.scope !== 'public') continue

      for (const post of Object.values(project.posts)) {
        if (post.scope !== 'public') continue
        if (post.updatedAt <= since.getTime()) continue
        if (post.updatedAt >= until.getTime()) continue
        if (requireAutoShare && post.autoShare === false) continue
        if (requireDiscordAccount && !user.profile?.connectedAccounts?.discord)
          continue

        const update = updateFromApiPost(context.baseUrl, post, user, project)
        updates.push(update)
      }
    }
  }
  updates.sort((a, b) => a.updatedAt - b.updatedAt)

  return updates.slice(0, limit)
}

export const profileProjects: LeafFieldResolver<ApiProfile> = async (
  obj,
  _args,
  context
) => {
  if (obj.projects) {
    return Object.values(obj.projects).map(project =>
      projectFromApiProject(context.baseUrl, project, context.parentUser)
    )
  }
  return []
}

export const projectUpdates: LeafFieldResolver<ApiProject> = async (
  obj,
  _args,
  context
) => {
  if (obj?.posts) {
    return Object.values(obj.posts).map(post =>
      updateFromApiPost(context.baseUrl, post, context.parentUser, obj)
    )
  }
  return []
}

function getBaseUrlFromRequest(req: NextApiRequest) {
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const host = req.headers.host
  return new URL(`${protocol}://${host}`)
}

const urlFromUser = (baseUrl: URL, user: ApiUser) => {
  const slug = user.publicPageSlug || user.systemSlug
  return new URL(`/user/${slug}`, baseUrl)
}

const userFromApiUser = (baseUrl: URL, user: ApiUser) => {
  const slug = user.publicPageSlug || user.systemSlug
  const url = urlFromUser(baseUrl, user)
  return {
    ...user,
    slug,
    url,
  }
}

const urlFromProject = (baseUrl: URL, project: ApiProject, user: ApiUser) => {
  return new URL(`${urlFromUser(baseUrl, user)}/project/${project.id}`)
}

const projectFromApiProject = (
  baseUrl: URL,
  project: ApiProject,
  user: ApiUser
) => {
  return {
    ...project,
    url: urlFromProject(baseUrl, project, user),
    imageSrc:
      project.imageAssetId &&
      cloudinaryUrlDirect(project.imageAssetId, 'project', project.imageMeta),
  }
}

const urlFromPost = (
  baseUrl: URL,
  post: ApiPost,
  project: ApiProject,
  user: ApiUser
) => {
  return new URL(`${urlFromProject(baseUrl, project, user)}/post/${post.id}`)
}

const updateFromApiPost = (
  baseUrl: URL,
  post: ApiPost,
  user: ApiUser,
  project: ApiProject
) => {
  let type = 'text'
  if (post.imageAssetId) type = 'image'
  if (post.linkUrl) type = 'link'

  return {
    ...post,
    type,
    url: urlFromPost(baseUrl, post, project, user),
    user: userFromApiUser(baseUrl, user),
    project: projectFromApiProject(baseUrl, project, user),
    linkMeta: post.urlMeta,
    imageSrc:
      post.imageAssetId &&
      cloudinaryUrlDirect(post.imageAssetId, 'post', post.imageMeta),
  }
}

export const resolvers = {
  ...scalarResolvers,
  Query: {
    user: queryUser,
    publicUpdates: queryPublicUpdates,
  },
  Profile: {
    projects: profileProjects,
  },
  Project: {
    updates: projectUpdates,
  },
}
