import type { NextApiRequest, NextApiResponse } from 'next'
import type { EmptySuccessWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthFirebaseApp } from '@/lib/serverAuth'
import { sessionCookieName } from '@/lib/apiConstants'
import Cookies from 'cookies'

const authCookieMaxAge = 1000 * 60 * 60 * 24 * 14

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // this method issues a session cookie given a firebase id token. it does not
  // yet know what actual graceland user is making the call, they might not have
  // been created yet. getOrCreateUser does that in the general auth middleware
  // handler once a valid session cookie is detected on subsequent requests.
  const idToken = req.body.idToken.toString()
  // console.log("sessionLogin idToken:",idToken)
  const cookies = new Cookies(req, res, {
    // we have to force the cookie lib to believe the connection is secure.
    // the appserver is non-tls and behind a tls terminating proxy.
    // x-forwarded-proto is https but the library doesn't know to trust that.
    secure: process.env.NEXT_PUBLIC_ENV_NAME !== 'dev',
  })
  // note that 'expiresIn' option for the firebase createSessionCookie sdk
  // method is the behavior of the 'maxAge' option in the Cookies sdk, whereas
  // in Cookies sdk, there is no 'expiresIn' field but there is an 'expires'
  // field that accepts a Date object (vs a number relative to current time)
  return getAuthFirebaseApp()
    .createSessionCookie(idToken, { expiresIn: authCookieMaxAge })
    .then(
      sessionCookie => {
        // Set cookie policy for session cookie.
        const options = {
          maxAge: authCookieMaxAge,
          httpOnly: true,
          sameSite: 'lax' as const,
          secure: process.env.NEXT_PUBLIC_ENV_NAME !== 'dev',
        }
        // DRY_r9725 session cookie name
        cookies.set(sessionCookieName, sessionCookie, options)
        // console.log("sessionLogin setting cookie", sessionCookieName, sessionCookie)
        const wrapper: EmptySuccessWrapper = {
          action: 'sessionLogin',
          status: 200,
          success: true,
        }
        res.status(200).json(wrapper)
      },
      e => {
        console.log('sessionLogin createSessionCookie error:', e)
        const wrapper: ErrorWrapper = {
          action: 'sessionLogin',
          status: 401,
          success: false,
          errorId: 'ERR_UNAUTHORIZED',
          errorMsg: 'could not generate a session cookie from given idToken',
        }
        res.status(401).json(wrapper)
      }
    )
}
