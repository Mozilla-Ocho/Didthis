import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import profileUtils from './profileUtils'
import Cookies from 'cookies'
import knex from '@/knex'
import log from '@/lib/log'
import { sessionCookieName } from './apiConstants'
import { getParamString } from './nextUtils'
import crypto from 'crypto'

export const signupCodes: {
  [key: string]: ApiSignupCodeInfo
} = {
  '1234': {
    active: true,
    value: '1234',
    name: 'dev',
    envNames: ['dev'],
  },
  a6fd47b9: {
    active: true,
    value: 'a6fd47b9',
    name: 'intshare1',
    envNames: ['dev', 'nonprod', 'prod'],
  },
  '011bda94': {
    active: true,
    value: '011bda94',
    name: 'ads-knitting',
    envNames: ['prod'],
  },
  d887cd80: {
    active: true,
    value: 'd887cd80',
    name: 'ads-woodworking',
    envNames: ['prod'],
  },
  '45ab2f54': {
    active: true,
    value: '45ab2f54',
    name: 'ads-cooking',
    envNames: ['prod'],
  },
  eedc6995: {
    active: true,
    value: 'eedc6995',
    name: 'ads-hiking',
    envNames: ['prod'],
  },
  fc7e57f7: {
    active: true,
    value: 'fc7e57f7',
    name: 'ads-fixing',
    envNames: ['prod'],
  },
  '37deb374': {
    active: true,
    value: '37deb374',
    name: 'ads-travel',
    envNames: ['prod'],
  },
  '6fda0933': {
    active: true,
    value: '6fda0933',
    name: 'ads-pottery',
    envNames: ['prod'],
  },
}

const toSeconds = (date: Date) => Math.floor(date.getTime() / 1000)

export const getValidCodeInfo = (userCode: string | undefined | false) => {
  const badCode = { active: false, value: userCode, name: '', envNames: [] }
  if (!userCode) return badCode
  const check = signupCodes[userCode]
  if (!check) return badCode
  if (!check.active) return badCode
  if (check.envNames.indexOf(process.env.NEXT_PUBLIC_ENV_NAME as string) < 0)
    return badCode
  return check
}

let firebaseApp: ReturnType<typeof initializeApp>

try {
  firebaseApp = initializeApp({
    credential: applicationDefault(),
  })
} catch (e) {
  // nextjs hot reloading / rendering throws errors in firebase initializeApp
  // about being called more than once.
}

const userFromDbRow = (
  dbRow: UserDbRow,
  opts: {
    publicFilter: boolean
    justCreated?: boolean
  }
): ApiUser => {
  const profile = opts.publicFilter
    ? profileUtils.privacyFilteredCopy(dbRow.profile)
    : dbRow.profile
  const user: ApiUser = {
    id: dbRow.id,
    email: dbRow.email,
    // note: next complains if objects have own properties whose value is
    // undefined. it's more strict than res.json(...) in this regard, so
    // avoid this:
    // userSlug: dbRow.user_slug || undefined,
    systemSlug: dbRow.system_slug,
    publicPageSlug: dbRow.user_slug || dbRow.system_slug,
    profile,
    createdAt: parseInt(dbRow.created_at_millis as string,10),
  }
  if (opts.publicFilter) {
    delete user.email
  }
  // only set the prop if defined
  if (dbRow.user_slug) user.userSlug = dbRow.user_slug
  if (!opts.publicFilter) {
    // DRY_47693 signup code logic
    user.signupCodeName = dbRow.signup_code_name || ''
    if (!dbRow.signup_code_name) user.unsolicited = true
  }
  if (dbRow.admin_status  === 'admin') user.isAdmin = true
  if (dbRow.ban_status === 'ghosted') user.isGhosted = true
  if (opts.justCreated) user.justCreated = true
  return user
}

const generateRandomAvailableSystemSlug = async () => {
  const mkRandSlug = () => {
    const chars = 'bcdfghjkmnpqrstvwxyz23456789'
    let slug = ''
    for (let i = 0; i < 8; i++) {
      slug = slug + chars[Math.floor(Math.random() * chars.length)]
    }
    return slug
  }
  let available = false
  let slug = mkRandSlug()
  while (!available) {
    const dbRow = (await knex('users')
      .where('user_slug_lc', slug.toLowerCase())
      .orWhere('system_slug', slug)
      .first()) as UserDbRow | undefined
    if (dbRow) {
      slug = mkRandSlug()
    } else {
      available = true
    }
  }
  return slug
}

const getOrCreateUser = async ({
  id,
  autoVivifyWithEmail, // optional. if not provided, will not autovivity
  signupCode,
}: {
  id: string
  autoVivifyWithEmail?: string
  signupCode: string | false
}): Promise<[ApiUser, UserDbRow] | [false, false]> => {
  const millis = new Date().getTime()
  let dbRow = (await knex('users').where('id', id).first()) as
    | UserDbRow
    | undefined
  const codeInfo = getValidCodeInfo(signupCode)
  if (dbRow) {
    // found
    if (codeInfo.active && !dbRow.signup_code_name) {
      // link the user to the valid sign up code present on the request if they
      // don't have one.
      dbRow = (
        await knex('users')
          .update({
            signup_code_name: codeInfo.name,
            updated_at_millis: millis,
            last_write_from_user: millis,
            last_read_from_user: millis,
          })
          .where('id', dbRow.id)
          .returning('*')
      )[0] as UserDbRow // "as" to coerce type as never undef, we can be sure we will get a record.
    }
    return [userFromDbRow(dbRow, { publicFilter: false }), dbRow]
  }
  // else, create new
  // DRY_r9639 user creation logic
  if (!autoVivifyWithEmail) {
    log.error(
      'user row not found, potentially a new signup, but autoVivifyWithEmail is falsy'
    )
    return [false, false]
  }
  log.serverApi('no user found, potentially a new signup, autovivifying')
  const systemSlug = await generateRandomAvailableSystemSlug()
  const columns: UserDbRowForWrite = {
    id,
    email: autoVivifyWithEmail,
    system_slug: systemSlug,
    user_slug: null,
    user_slug_lc: null,
    profile: profileUtils.mkDefaultProfile(),
    signup_code_name: codeInfo && codeInfo.active ? codeInfo.name : null,
    created_at_millis: millis,
    updated_at_millis: millis,
    last_write_from_user: millis,
    last_read_from_user: millis,
    admin_status: null,
    ban_status: null,
  }
  dbRow = (await knex('users').insert(columns).returning('*'))[0] as UserDbRow
  log.serverApi('created user', dbRow.id)
  return [
    userFromDbRow(dbRow, { publicFilter: false, justCreated: true }),
    dbRow,
  ]
}

// we want very long-lived sessions so we are not using firebase admin sdk's
// built in session cookie featuer which cap at 14 days
const sessionCookieMaxAgeMillis = 1000 * 60 * 60 * 24 * 180
// this is the period of time for which existing session cookies can still work
// after a user resets their password. smaller is more secure, but at the cost
// of latency to the user for roundtripping to firebase to check the validity.
const sessionCookieRevalidateMillis = 1000 * 60 * 5

const mkSessionCookie = (uid: string, issued: number, revalidated: number) => {
  const content = [1, uid, issued, revalidated].join('|')
  if (!process.env.SESSION_COOKIE_SECRET)
    throw new Error('missing SESSION_COOKIE_SECRET')
  const sig = crypto
    .createHmac('sha256', process.env.SESSION_COOKIE_SECRET)
    .update(content)
    .digest('hex')
  return [content, sig].join(':')
}

type SessionCookieValidity =
  | { valid: false }
  | {
      valid: true
      uid: string
      newCookie: string
      roundtrip: boolean
      email?: string // only present on roundtrip
    }

const verifySessionCookie = async (
  cookie: string,
  roundtrip: boolean
): Promise<SessionCookieValidity> => {
  // TODO b64 encode cookie
  const [content, sig] = cookie.split(':')
  const [version, uid, issued, revalidated] = content.split('|')
  const failResult = { valid: false as const }
  log.serverApi('validating session cookie', cookie, 'roundtrip:', roundtrip)
  if (!(version && uid && issued && revalidated && sig)) {
    log.warn('bad session cookie format')
    return failResult
  }
  if (!process.env.SESSION_COOKIE_SECRET)
    throw new Error('missing SESSION_COOKIE_SECRET')
  const expectSig = crypto
    .createHmac('sha256', process.env.SESSION_COOKIE_SECRET)
    .update(content)
    .digest('hex')
  if (expectSig !== sig) {
    log.warn('session cookie signature check failed')
    return failResult
  }
  const issuedInt = parseInt(issued, 10)
  if (Number.isNaN(issuedInt)) {
    log.warn('session cookie issued time isNaN')
    return failResult
  }
  const issuedDate = new Date(issuedInt * 1000)
  const expiryDate = new Date((issuedInt + 365 * 24 * 60 * 60) * 1000)
  const now = new Date()
  if (now > expiryDate) {
    log.warn('session cookie issued time expired')
    return failResult
  }
  const revalInt = parseInt(revalidated, 10)
  if (Number.isNaN(revalInt)) {
    log.warn('session cookie revalidated time isNaN')
    return failResult
  }
  if (now > new Date(revalInt * 1000 + sessionCookieRevalidateMillis)) {
    log.serverApi('session cookie revalidation time expired, round tripping')
    roundtrip = true
  }
  if (!roundtrip) {
    return {
      valid: true,
      uid,
      newCookie: cookie,
      roundtrip: false,
    }
  } else {
    const auth = getAuth(firebaseApp)
    try {
      const userRecord = await auth.getUser(uid)
      if (userRecord) {
        const minValidTimeUtcStr = userRecord.tokensValidAfterTime
        // log.debug('userrecord:', userRecord)
        // log.debug('minValidTimeUtcStr:', minValidTimeUtcStr)
        if (!minValidTimeUtcStr) {
          log.error('no tokensValidAfterTime found on user record in firebase')
          return failResult
        }
        if (new Date(Date.parse(minValidTimeUtcStr)) > issuedDate) {
          log.error('tokensValidAfterTime has invalidated this cookie')
          return failResult
        }
        if (typeof userRecord.email === 'undefined') {
          log.error('userRecord has no email')
          return failResult
        }
      } else {
        log.error('no firebase user record for uid found')
        return failResult
      }
      // log.debug('returning full roundtrip validity; newcookie:',
      //   mkSessionCookie(uid, toSeconds(issuedDate), toSeconds(new Date())))
      return {
        valid: true,
        uid: userRecord.uid,
        newCookie: mkSessionCookie(
          uid,
          toSeconds(issuedDate),
          toSeconds(new Date())
        ),
        email: userRecord.email as string,
        roundtrip: true,
      }
    } catch (e) {
      log.error('error caught in verifySessionCookie', e)
    }
  }
  return failResult
}

// reads the Authorization header for the bearer token and validates it, looks
// up the user record if any. assigns or updates the session cookie, too
const getAuthUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<[ApiUser, UserDbRow] | [false, false]> => {
  const cookies = new Cookies(req, res, {
    // explicitly tell cookies lib whether to use secure cookies, rather
    // than having it inspect the request, which won't work due to
    // x-forwarded-proto being the real value.
    secure: process.env.NEXT_PUBLIC_ENV_NAME !== 'dev',
  })
  const cookieOptions = {
    maxAge: sessionCookieMaxAgeMillis,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NEXT_PUBLIC_ENV_NAME !== 'dev',
  }
  let sessionCookie = cookies.get(sessionCookieName) || ''
  // on session login, an id token is provided in lieu of a session cookie. we
  // validate the id token, make a new session cookie value, and proceed with
  // regular auth logic.
  // req.body isn't always present b/c we are coercing a different kind of
  // request when doing SSR
  const idToken = req.body && req.body.idToken && req.body.idToken.toString()
  if (idToken) {
    log.serverApi('idToken present, using for new session')
    try {
      const decodedIdToken = await getAuth(firebaseApp).verifyIdToken(
        idToken,
        true
      )
      // log.debug('decodedIdToken', decodedIdToken)
      // when setting a cookie for the first time, revalidated = 0 to force roundtrip
      sessionCookie = mkSessionCookie(
        decodedIdToken.uid,
        toSeconds(new Date()),
        0
      )
    } catch (e) {
      log.serverApi('idToken validation failed', e)
      cookies.set(sessionCookieName) // clear cookie
      return [false, false]
    }
  }
  // log.serverApi('sessionCookie', sessionCookie);
  if (!sessionCookie) return Promise.resolve([false, false])
  const signupCode = getParamString(req, 'signupCode') || false
  let validity = await verifySessionCookie(sessionCookie, false)
  if (validity.valid === false) {
    cookies.set(sessionCookieName) // clear cookie
    return [false, false]
  }
  log.serverApi('session valid, fetching user', validity.uid)
  const [apiuser, dbrow] = await getOrCreateUser({
    id: validity.uid,
    signupCode,
    // note no email is present on the validity result at this point
  })
  if (apiuser) {
    // we have the user in the db already and don't need to fetch email from
    // firebase.
    // log.debug('cookie set:', validity.newCookie)
    cookies.set(sessionCookieName, validity.newCookie, cookieOptions)
    return [apiuser, dbrow]
  } else {
    if (!validity.roundtrip) {
      // need to autovivify, but we need email + roundtrip for that
      validity = await verifySessionCookie(sessionCookie, true)
      if (validity.valid === false) {
        cookies.set(sessionCookieName) // clear cookie
        return [false, false]
      }
    }
    const [apiuser2, dbrow2] = await getOrCreateUser({
      id: validity.uid,
      autoVivifyWithEmail: validity.email,
      signupCode,
    })
    if (apiuser2) {
      // log.debug('cookie set:', validity2.newCookie)
      cookies.set(sessionCookieName, validity.newCookie, cookieOptions)
      return [apiuser2, dbrow2]
    } else {
      return [false, false]
    }
  }
}

const getAuthFirebaseApp = () => getAuth(firebaseApp)

export { getAuthUser, userFromDbRow, getAuthFirebaseApp, mkSessionCookie }
