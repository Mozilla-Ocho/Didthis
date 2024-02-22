import type { NextApiRequest, NextApiResponse } from 'next'
import type { MeWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import knex from '@/knex'
// import log from '@/lib/log'

// the main route used by the SPA to fetch the authenticated user's own user
// record and also asserts an authenticated session is active for the client.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [user] = await getAuthUser(req, res)
  if (user) {
    const wrapper: MeWrapper = {
      action: 'getMe',
      status: 200,
      success: true,
      payload: user,
    }
    res.status(200).json(wrapper)
  } else {
    const wrapper: ErrorWrapper = {
      action: 'me',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized',
    }
    res.status(401).json(wrapper)
  }
}
