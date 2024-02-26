import type { NextApiRequest, NextApiResponse } from 'next'
import type {
  SessionLoginAsTrialUserWrapper,
  ErrorWrapper,
} from '@/lib/apiConstants'
import {
  getAuthUser,
  signupCodes,
  createTrialUser,
  loginSessionForUser,
} from '@/lib/serverAuth'
import {getParamString} from '@/lib/nextUtils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [user, _userDbRow] = await getAuthUser(req, res)
  const { signupCode } = req.body || {}
  const signupCodeValid =
    signupCode && signupCode in signupCodes && signupCodes[signupCode].active

  if (user || !signupCodeValid) {
    return res.status(401).json({
      action: 'authentication',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized',
    } as ErrorWrapper)
  }

  const appPlatform = (getParamString(req, 'appPlatform') as AppPlatformType) || undefined

  const [newUser, _newUserDbRow] = await createTrialUser({ signupCode, appPlatform })

  if (!newUser) {
    return res.status(401).json({
      action: 'sessionLoginAsTrialUser',
      status: 500,
      success: false,
      errorId: 'ERR_CREATION_FAILED',
      errorMsg: 'trial user creation failed',
    } as ErrorWrapper)
  }

  await loginSessionForUser(req, res, newUser)

  res.status(201).json({
    action: 'sessionLoginAsTrialUser',
    status: 201,
    success: true,
    payload: newUser,
  } as SessionLoginAsTrialUserWrapper)
}
