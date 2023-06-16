import type { NextApiRequest, NextApiResponse } from 'next'
import type { SaveProfileWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import knex from '@/knex'

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
  const inputProfile = req.body.profile
  // XXX validation
  // this api ignores the value of "projects" as a property on the profile and
  // preserves whats there already.
  profile.name = inputProfile.name
  profile.bio = inputProfile.bio
  profile.imageAssetId = inputProfile.imageAssetId
  profile.imageMeta = inputProfile.imageMeta
  await knex('users')
    .update({
      last_read_from_user: millis,
      updated_at_millis: millis,
      profile: profile,
    })
    .where('id', user.id)
  user.updatedAt = millis
  user.profile = profile
  const wrapper: SaveProfileWrapper = {
    action: 'saveProfile',
    status: 200,
    success: true,
    payload: user,
  }
  res.status(200).json(wrapper)
}
