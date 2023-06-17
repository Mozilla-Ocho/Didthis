import type { NextApiRequest, NextApiResponse } from 'next'
import type { DeleteProjectWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import knex from '@/knex'
// import log from '@/lib/log'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [user] = await getAuthUser(req, res)
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
  const projectId = req.body.projectId as ApiProjectId
  const project = profile.projects[projectId]
  if (!project) {
    const wrapper: ErrorWrapper = {
      action: 'deleteProject',
      status: 400,
      success: false,
      errorId: 'ERR_BAD_INPUT',
      errorMsg: 'invalid project id',
    }
    res.status(400).json(wrapper)
    return
  }
  delete profile.projects[projectId]
  await knex('users')
    .update({
      last_read_from_user: millis,
      updated_at_millis: millis,
      profile: profile,
    })
    .where('id', user.id)
  user.updatedAt = millis
  user.profile = profile
  const wrapper: DeleteProjectWrapper = {
    action: 'deleteProject',
    status: 200,
    success: true,
    payload: user,
  }
  res.status(200).json(wrapper)
}
