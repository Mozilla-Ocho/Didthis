import type { NextApiRequest, NextApiResponse } from 'next'
import type { EmptySuccessWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'

// this used to be a complex call but it is now just a run through the standard
// per-request authentication logic, which manages session cookies, and also
// detects the idToken passed in on this specific api method.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [user] = await getAuthUser(req, res)
  if (user) {
    const wrapper: EmptySuccessWrapper = {
      action: 'sessionLogin',
      status: 200,
      success: true,
    }
    res.status(200).json(wrapper)
  } else {
    const wrapper: ErrorWrapper = {
      action: 'sessionLogin',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'could not generate a session cookie from given idToken',
    }
    res.status(401).json(wrapper)
  }
}
