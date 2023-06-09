import type { NextApiRequest, NextApiResponse } from 'next';
import type { NewPostWrapper, ErrorWrapper } from '@/lib/apiConstants';
import { getAuthUser } from '@/lib/serverAuth';
import knex from '@/knex';
import profileUtils from '@/lib/profileUtils';
import log from '@/lib/log';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getAuthUser(req, res);
  log.serverApi('newPost user', user);
  if (!user) {
    const wrapper: ErrorWrapper = {
      action: 'authentication',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized',
    };
    res.status(401).json(wrapper);
    return;
  }
  const millis = new Date().getTime();
  const profile = user.profile;
  log.serverApi('newPost user profile:', profile);
  const inputPost = req.body.post;
  log.serverApi('newPost input:', inputPost);
  // XXX validation of post
  const post = {
    ...inputPost,
    id: profileUtils.generateRandomAvailablePostId(profile),
    createdAt: Math.floor(millis / 1000),
    updatedAt: Math.floor(millis / 1000),
  };
  if (post.projectId === 'new') {
    const { projectId } = profileUtils.mkNewProject(profile);
    post.projectId = projectId;
  }
  const project = profile.projects[post.projectId];
  if (!project) {
    const wrapper: ErrorWrapper = {
      action: 'newPost',
      status: 400,
      success: false,
      errorId: 'ERR_BAD_INPUT',
      errorMsg: 'invalid project id',
    };
    res.status(400).json(wrapper);
    return;
  }
  project.posts[post.id] = post;
  project.updatedAt = Math.floor(millis / 1000);
  log.serverApi('newPost saving:', profile);
  await knex('users')
    .update({
      last_read_from_user: millis,
      updated_at_millis: millis,
      profile: profile,
    })
    .where('id', user.id)
  user.updatedAt = millis;
  user.profile = profile;
  const wrapper: NewPostWrapper = {
    action: 'newPost',
    status: 200,
    success: true,
    payload: { user, post },
  };
  log.serverApi('newPost resp:', wrapper);
  res.status(200).json(wrapper);
}
