import type { NextApiRequest, NextApiResponse } from 'next'
import type { SavedPostWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import knex from '@/knex'
import profileUtils from '@/lib/profileUtils'
import log from '@/lib/log'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getAuthUser(req, res)
  log.serverApi('savePost user', user)
  if (!user) {
    const wrapper: ErrorWrapper = {
      action: 'authentication',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized',
    }
    res.status(401).json(wrapper)
    return
  }
  const millis = new Date().getTime()
  const profile = user.profile
  log.serverApi('savePost user profile:', profile)
  const inputPost = req.body.post as ApiPost
  log.serverApi('savePost input:', inputPost)
  // XXX validation of post
  const post = {
    ...inputPost,
  } as ApiPost
  if (post.id === "new") {
    post.id = profileUtils.generateRandomAvailablePostId(profile)
  }
  if (post.projectId === 'new') {
    // note mkNewProject mutates profile
    const { projectId } = profileUtils.mkNewProject(profile)
    post.projectId = projectId
  }
  const project = profile.projects[post.projectId]
  if (!project) {
    const wrapper: ErrorWrapper = {
      action: 'savePost',
      status: 400,
      success: false,
      errorId: 'ERR_BAD_INPUT',
      errorMsg: 'invalid project id',
    }
    res.status(400).json(wrapper)
    return
  }
  const existingPost = project.posts[post.id]
  if (existingPost) {
    post.createdAt = existingPost.createdAt
  } else {
    post.createdAt = Math.floor(millis / 1000)
  }
  post.updatedAt = Math.floor(millis / 1000)
  project.posts[post.id] = post
  project.updatedAt = Math.floor(millis / 1000)
  log.serverApi('savePost saving:', profile)
  await knex('users')
    .update({
      last_read_from_user: millis,
      updated_at_millis: millis,
      profile: profile,
    })
    .where('id', user.id)
  user.updatedAt = millis
  user.profile = profile
  const wrapper: SavedPostWrapper = {
    action: 'savePost',
    status: 200,
    success: true,
    payload: { user, post },
  }
  log.serverApi('savePost resp:', wrapper)
  res.status(200).json(wrapper)
}
