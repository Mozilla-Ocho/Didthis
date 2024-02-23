import type { NextApiRequest, NextApiResponse } from 'next'
import type {
  SessionLoginWithAppleIdWrapper,
  ErrorWrapper,
} from '@/lib/apiConstants'
import { loginSessionForUser } from '@/lib/serverAuth'
import {
  validateAuthenticationCredential,
  autoVivifyAppleUser,
} from '@/lib/appleAuth'
import { getParamString } from '@/lib/nextUtils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { credential } = req.body || {}

  // First, attempt to validate the given Apple ID credential.
  let validCredential: Awaited<
    ReturnType<typeof validateAuthenticationCredential>
  >
  try {
    validCredential = await validateAuthenticationCredential(credential)
  } catch (e) {
    return res.status(401).json({
      action: 'authentication',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: `unauthorized - error validating credential - ${e}`,
    } as ErrorWrapper)
  }

  // DRY_27098 tracking app platform in user signups.
  // the default value is native-ios because older versions of the ios app
  // don't send a param here, but the web signups will have the latest code.
  const appPlatform = (getParamString(req, 'appPlatform') as AppPlatformType) || 'native-ios'

  // Next, take the valid credential and attempt to get or create a user.
  const apiUser = await autoVivifyAppleUser({...validCredential, appPlatform})

  if (!apiUser) {
    return res.status(401).json({
      action: 'authentication',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized - error creating user',
    } as ErrorWrapper)
  }

  await loginSessionForUser(req, res, apiUser)

  res.status(201).json({
    action: 'sessionLoginWithAppleId',
    status: 201,
    success: true,
    payload: apiUser,
  } as SessionLoginWithAppleIdWrapper)
}
