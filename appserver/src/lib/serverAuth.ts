import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import profileUtils from './profileUtils';
import Cookies from 'cookies';
import knex from '@/knex';
import log from '@/lib/log';
import * as constants from '@/lib/constants';

let firebaseApp: ReturnType<typeof initializeApp>;

try {
  firebaseApp = initializeApp({
    credential: applicationDefault(),
  });
} catch (e) {
  // nextjs hot reloading / rendering throws errors in firebase initializeApp
  // about being called more than once.
}

const userFromDbRow = (
  dbRow: UserDbRow,
  opts: { publicFilter: boolean; includeAdminUIFields?: boolean }
): ApiUser => {
  const profile = opts.publicFilter
    ? profileUtils.privacyFilteredCopy(dbRow.profile)
    : dbRow.profile;
  const user: ApiUser = {
    id: dbRow.id,
    email: dbRow.email,
    urlSlug: dbRow.url_slug,
    profile,
    createdAt: dbRow.created_at_millis,
    fullName: dbRow.full_name || undefined,
  };
  if (!opts.publicFilter && !opts.includeAdminUIFields) {
    // DRY_47693 signup code logic
    user.signupCodeName = dbRow.signup_code_name || '';
    if (!dbRow.signup_code_name) user.unsolicited = true;
  }
  if (dbRow.admin_status === 'admin') user.isAdmin = true;
  if (dbRow.ban_status === 'banned') user.isBanned = true;
  if (opts.includeAdminUIFields) {
    // signupCodeName was in here but is now just always returned
    user.lastFullPageLoad = dbRow.last_read_from_user || undefined;
    user.lastWrite = dbRow.last_write_from_user || undefined;
    user.updatedAt = dbRow.updated_at_millis;
  }
  return user;
};

const generateRandomAvailableSlug = async () => {
  const mkRandSlug = () => {
    const chars = 'bcdfghjkmnpqrstvwxyz23456789';
    let slug = '';
    for (let i = 0; i < 8; i++) {
      slug = slug + chars[Math.floor(Math.random() * chars.length)];
    }
    return slug;
  };
  let available = false;
  let slug = mkRandSlug();
  while (!available) {
    const dbRow = (await knex('users').where('url_slug', slug).first()) as
      | UserDbRow
      | undefined;
    if (dbRow) {
      slug = mkRandSlug();
    } else {
      available = true;
    }
  }
  return slug;
};

const getOrCreateUser = async ({
  id,
  email,
}: {
  id: string;
  email: string;
}): Promise<ApiUser> => {
  const millis = new Date().getTime();
  let dbRow = (await knex('users').where('id', id).first()) as
    | UserDbRow
    | undefined;
  // XXX_PORTING
  // const codeInfo = validateSignupCode(req.query.signupCode || "");
  if (dbRow) {
    // found
    // if (codeInfo.codeStatus === "active" && !dbRow.signup_code_name) {
    //   // link the user to the valid sign up code present on the request if they
    //   // don't have one.
    //   dbRow = (
    //     await knex("users")
    //       .update({
    //         signup_code_name: codeInfo.codeName,
    //         updated_at_millis: millis,
    //         last_write_from_user: millis,
    //         last_read_from_user: millis,
    //       })
    //       .where("id", dbRow.id)
    //       .returning("*")
    //   )[0];
    // }
    return userFromDbRow(dbRow, { publicFilter: false });
  }
  // else, create new
  // DRY_r9639 user creation logic
  log.serverApi('no user found, potentially a new signup, autovivifying');
  const newSlug = await generateRandomAvailableSlug();
  const columns: UserDbRow = {
    id,
    email: email,
    url_slug: newSlug,
    profile: profileUtils.mkDefaultProfile(),
    full_name: null,
    //signup_code_name: codeInfo.codeName || null,
    signup_code_name: null, // XXX_PORTING
    created_at_millis: millis,
    updated_at_millis: millis,
    last_write_from_user: millis,
    last_read_from_user: millis,
    admin_status: null,
    ban_status: null,
  };
  dbRow = (await knex('users').insert(columns).returning('*'))[0] as UserDbRow;
  log.serverApi('created user', dbRow.id);
  // XXX_PORTING
  // setReqAuthentication(req, dbRow); // have to set this early here so track event can obtain the new auth user id
  // trackEventReqEvtOpts(req, trackingEvents.caSignup, {
  //   signupCodeName: codeInfo.codeName || "none",
  // });
  return userFromDbRow(dbRow, { publicFilter: false });
};

// reads the Authorization header for the bearer token and validates it, looks
// up the user record if any
const getAuthUser = (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<ApiUser | null> => {
  const cookies = new Cookies(req, res, {
    // explicitly tell cookies lib whether to use secure cookies, rather
    // than having it inspect the request, which won't work due to
    // x-forwarded-proto being the real value.
    secure: process.env.NEXT_PUBLIC_ENV_NAME !== 'dev',
  });
  // DRY_r9725 session cookie name
  const sessionCookie = cookies.get(constants.sessionCookieName) || '';
  // log.serverApi('sessionCookie', sessionCookie);
  if (!sessionCookie) return Promise.resolve(null);
  return (
    getAuth(firebaseApp)
      // XXX TODO: false here is insecure in that is doesn't deal with password
      // reset invalidation of sessions. however, setting it true costs ~500ms of
      // latency which is totally unacceptable for most pages, and with nextjs
      // SSR it happens on every page navigation. i need to add logic to manage a
      // nonce per user that is changed on password resets somehow, even though
      // that happens on the firebase end of things. or perhaps implement a
      // server-signed and validated cookie that supresses revocation checks for
      // N minutes then expires, forcing a revocation check then reissuing the
      // suppression cookie. and: have POST methods use revokation checks.
      .verifySessionCookie(sessionCookie, false)
      .then(decodedClaims => {
        // console.serverApi("decodedClaims",decodedClaims)
        // decodedClaims looks like: {
        //   iss: 'https://session.firebase.google.com/grac3land-dev',
        //   aud: 'grac3land-dev',
        //   auth_time: 1667113902,
        //   user_id: 'IUHkIdKRZVV6S9aZ02P8Fokejqx2',
        //   sub: 'IUHkIdKRZVV6S9aZ02P8Fokejqx2',
        //   iat: 1667114699,
        //   exp: 1668324299,
        //   email: 'jwhiting+1@mozilla.com',
        //   email_verified: false,
        //   firebase: { identities: { email: [Array] }, sign_in_provider: 'password' },
        //   uid: 'IUHkIdKRZVV6S9aZ02P8Fokejqx2'
        // }
        log.serverApi('session valid, fetching user', decodedClaims.user_id);
        return getOrCreateUser({
          id: decodedClaims.user_id,
          email: decodedClaims.email || '',
        });
      })
      .catch(() => {
        log.serverApi('sessionCookie failed firebase verification');
        // TODO: delete cookie here?
        return null;
      })
  );
};

const getAuthFirebaseApp = () => getAuth(firebaseApp);

export { getAuthUser, userFromDbRow, getAuthFirebaseApp };
