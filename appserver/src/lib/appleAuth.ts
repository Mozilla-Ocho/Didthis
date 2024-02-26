import * as jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import knex from '@/knex'
import { getOrCreateUser, SIGNUP_CODE_FOR_APPLEID } from '@/lib/serverAuth'

export const JWT_KEY_FETCH_TIMEOUT = 30000
export const APPLE_PUBLIC_KEY_URL = 'https://appleid.apple.com/auth/keys'
export const APPLE_JWT_ISSUER = 'https://appleid.apple.com'

// TODO: make this configurable and constrain for real app vs Expo Go
export const VALID_JWT_AUDIENCES = [
  'org.mozilla.Didthis',
  'org.mozilla.didthis.web',
  'host.exp.Exponent',
]

if (process.env.NEXT_PUBLIC_APPLE_CLIENT_ID) {
  VALID_JWT_AUDIENCES.push(process.env.NEXT_PUBLIC_APPLE_CLIENT_ID)
}

export async function verifyIdentityToken(identityToken: string) {
  const decodedIdentityToken = jwt.decode(identityToken, { complete: true })
  if (!decodedIdentityToken) {
    throw new Error('could not decode identityToken')
  }

  const client = jwksClient({
    jwksUri: APPLE_PUBLIC_KEY_URL,
    timeout: JWT_KEY_FETCH_TIMEOUT,
  })
  const key = await client.getSigningKey(decodedIdentityToken.header.kid)
  const signingKey = key.getPublicKey()
  const verifiedIdentityToken = jwt.verify(identityToken, signingKey)

  if (typeof verifiedIdentityToken !== 'object') {
    throw new Error(`unexpected result from jwtVerify: {res}`)
  }

  const { aud, iss, exp, sub, email } = verifiedIdentityToken

  if (APPLE_JWT_ISSUER !== iss) {
    throw new Error('invalid issuer for identityToken')
  }
  if (!aud || typeof aud !== 'string' || !VALID_JWT_AUDIENCES.includes(aud)) {
    // TODO: token.aud could be an array?
    throw new Error('invalid audience for identityToken')
  }
  if (exp && exp < Date.now() / 1000) {
    throw new Error('identityToken expired')
  }
  if (typeof sub !== 'string') {
    throw new Error('subject missing')
  }
  if (typeof email !== 'string') {
    throw new Error('email missing')
  }

  return { aud, iss, exp, sub, email }
}

export async function validateAuthenticationCredential(
  credential: AppleAuthenticationCredential
) {
  const { user, fullName, identityToken } = credential
  if (!identityToken) {
    throw new Error('no identityToken found')
  }
  const { sub, email } = await verifyIdentityToken(identityToken)
  if (user) {
    if (sub !== user) {
      throw new Error('invalid subject for identityToken')
    }
  }
  // Treat `sub` as equivalent to `user`, since it might not be passed in
  // the credential (e.g. via web sign-in)
  return { user: sub, fullName, sub, email }
}

export async function autoVivifyAppleUser({
  email,
  user,
  appPlatform,
}: {
  email: string
  user: string
  appPlatform?: AppPlatformType
}) {
  const signupCode = SIGNUP_CODE_FOR_APPLEID

  // Check whether we already have an account for this email address
  const existingDbRow = (await knex('users')
    .where('email', email)
    .returning('id')
    .first()) as UserDbRow | undefined

  // Use the uid of existing account for email, or use a uid derived from Apple credential.
  const uid = existingDbRow ? existingDbRow.id : `appleid-${user}`

  // Finally, get or create the user based on Apple credential.
  const [apiUser] = await getOrCreateUser({
    id: uid,
    autoVivifyWithEmail: email,
    signupCode,
    // DRY_27098 tracking app platform in user signups
    appPlatform,
    authMethod: 'apple',
  })

  return apiUser
}

// TODO: Types copied from expo-apple-authentication - could we use that package directly just for the types?

export type AppleAuthenticationCredential = {
  user?: string
  state?: string | null
  fullName?: AppleAuthenticationFullName | null
  email?: string | null
  realUserStatus?: AppleAuthenticationUserDetectionStatus
  identityToken: string | null
  authorizationCode: string | null
}

export type AppleAuthenticationFullName = {
  namePrefix: string | null
  givenName: string | null
  middleName: string | null
  familyName: string | null
  nameSuffix: string | null
  nickname: string | null
}

export enum AppleAuthenticationUserDetectionStatus {
  UNSUPPORTED = 0,
  UNKNOWN = 1,
  LIKELY_REAL = 2,
}
