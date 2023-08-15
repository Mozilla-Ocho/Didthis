import type { NextApiRequest, NextApiResponse } from 'next'
import type { SaveProfileWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser, signupCodes, createTrialUser } from '@/lib/serverAuth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [user, _userDbRow] = await getAuthUser(req, res)
  const { signupCode } = req.body || {}
  const signupCodeValid =
    signupCode && signupCode in signupCodes && signupCodes[signupCode].active

  if (user || !signupCodeValid) {
    const wrapper: ErrorWrapper = {
      action: 'authentication',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized',
    }
    return res.status(401).json(wrapper)
  }

  const [newUser, _newUserDbRow] = await createTrialUser({ signupCode })

  const wrapper = {
    action: 'createProfile',
    status: 201,
    success: true,
    payload: newUser
  }
  res.status(201).json(wrapper)
}
