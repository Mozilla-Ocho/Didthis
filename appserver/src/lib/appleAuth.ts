import * as jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

export const JWT_KEY_FETCH_TIMEOUT = 30000
export const APPLE_PUBLIC_KEY_URL = 'https://appleid.apple.com/auth/keys'
export const APPLE_JWT_ISSUER = 'https://appleid.apple.com'

// TODO: make this configurable and constrain for real app vs Expo Go
export const VALID_JWT_AUDIENCES = ['org.mozilla.Didthis', 'host.exp.Exponent']

export async function validateAuthenticationCredential(
  credential: AppleAuthenticationCredential
) {
  const { user, fullName, identityToken } = credential
  if (!identityToken) {
    throw new Error('no identityToken found')
  }

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
  if (sub !== user) {
    throw new Error('invalid subject for identityToken')
  }
  if (exp && exp < Date.now() / 1000) {
    throw new Error('identityToken expired')
  }

  return { user, fullName, sub, email }
}

// TODO: Types copied from expo-apple-authentication - could we use that package directly just for the types?

export type AppleAuthenticationCredential = {
  user: string
  state: string | null
  fullName: AppleAuthenticationFullName | null
  email: string | null
  realUserStatus: AppleAuthenticationUserDetectionStatus
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
