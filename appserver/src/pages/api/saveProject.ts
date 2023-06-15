import type { NextApiRequest, NextApiResponse } from 'next'
import type { NewProjectWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import knex from '@/knex'
import log from '@/lib/log'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getAuthUser(req, res)
  log.serverApi('newProject user', user)
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
  log.serverApi('newProject user profile:', profile)
  const inputProject = req.body.project
  log.serverApi('newProject input:', inputProject)
  // XXX validation
  // XXX project writes don't behave like post writes
  // XXX rename to putProject (create+update)
  const project = {
    ...inputProject,
    createdAt: Math.floor(millis / 1000),
    updatedAt: Math.floor(millis / 1000),
  } as ApiProject
  // this api ignores the value of "posts" as a property on the project and
  // preserves whats there or sets to [] for new projects.
  const existingProject = profile.projects[project.id]
  if (existingProject) {
    // do not overwrite posts in this method.
    project.posts = existingProject.posts
  } else {
    // start w/ empty posts.
    project.posts = {}
  }
  profile.projects[project.id] = project
  log.serverApi('newProject saving:', profile)
  await knex('users')
    .update({
      last_read_from_user: millis,
      updated_at_millis: millis,
      profile: profile,
    })
    .where('id', user.id)
  user.updatedAt = millis
  user.profile = profile
  const wrapper: NewProjectWrapper = {
    action: 'newPost',
    status: 200,
    success: true,
    payload: { user, project },
  }
  log.serverApi('newProject resp:', wrapper)
  res.status(200).json(wrapper)
}

