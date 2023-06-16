import type { NextApiRequest, NextApiResponse } from 'next'
import type { SlugCheckWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import { getParamString } from '@/lib/nextUtils'
import { checkAvailability, getSuggestedSlug } from '@/lib/userSlugs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [user, userDbRow] = await getAuthUser(req, res)
  if (!user) {
    const wrapper: ErrorWrapper = {
      action: 'slugCheck',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized',
    }
    res.status(401).json(wrapper)
    return
  }
  const slug = getParamString(req, 'userSlug')
  const check = await checkAvailability(slug, user)
  const source = userDbRow.user_slug ? 'user' : 'system'
  let suggested = undefined
  if (source === 'system') {
    const provisionalName = getParamString(req, 'provisionalName')
    suggested = await getSuggestedSlug(user, provisionalName)
  }
  const wrapper: SlugCheckWrapper = {
    action: 'slugCheck',
    status: 200,
    success: true,
    payload: {
      currentSystem: user.systemSlug,
      currentUser: user.userSlug,
      check: check,
      source,
      suggested,
    },
  }
  res.status(200).json(wrapper)
}
