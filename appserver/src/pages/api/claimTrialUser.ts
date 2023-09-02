import type { NextApiRequest, NextApiResponse } from 'next'
import type { ClaimTrialUserWrapper, ErrorWrapper } from '@/lib/apiConstants'
import {
  getAuthUser,
  claimTrialUser,
  loginSessionForUser,
} from '@/lib/serverAuth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [user, _userDbRow] = await getAuthUser(req, res)
  const { claimIdToken } = req.body || {}

  if (!user || !user.isTrial || !claimIdToken) {
    return res.status(401).json({
      action: 'authentication',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized',
    } as ErrorWrapper)
  }

  const claimedUser = await claimTrialUser({ user, claimIdToken })

  if (!claimedUser) {
    return res.status(401).json({
      action: 'sessionLoginAsTrialUser',
      status: 500,
      success: false,
      errorId: 'ERR_CREATION_FAILED',
      errorMsg: 'trial user creation failed',
    } as ErrorWrapper)
  }

  await loginSessionForUser(req, res, claimedUser)

  res.status(200).json({
    action: 'claimTrialUser',
    status: 200,
    success: true,
    payload: claimedUser,
  } as ClaimTrialUserWrapper)
}
