import type { NextApiRequest, NextApiResponse } from 'next'
import type {
  SessionLoginWithAppleIdWrapper,
  ErrorWrapper,
} from '@/lib/apiConstants'
import {
  getOrCreateUser,
  SIGNUP_CODE_FOR_APPLEID,
  loginSessionForUser,
} from '@/lib/serverAuth'
import { validateAuthenticationCredential } from '@/lib/appleAuth'
import knex from '@/knex'

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

  // TODO: Simplify and move this account creation stuff into appleAuth.ts? or serverAuth.ts?

  // Next, take the valid credential and attempt to get or create a user.
  const { email, fullName, user: appleUserId } = validCredential
  const signupCode = SIGNUP_CODE_FOR_APPLEID

  // Check whether we already have an account for this email address
  const existingDbRow = (await knex('users')
    .where('email', email)
    .returning('id')
    .first()) as UserDbRow | undefined

  // Use the uid of existing account for email, or use a uid derived from Apple credential.
  const uid = existingDbRow ? existingDbRow.id : `appleid-${appleUserId}`

  // Finally, get or create the user based on Apple credential.
  const [apiUser, dbRow] = await getOrCreateUser({
    id: uid,
    autoVivifyWithEmail: email,
    signupCode,
  })

  // TODO: update user profile with fullName?

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
