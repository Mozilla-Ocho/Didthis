import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { UserProfile } from "@/lib/UserProfile";
import Cookies from "cookies";
import knex from "@/knex";
import log from "@/lib/log";
import * as constants from "@/lib/constants";

let firebaseApp: ReturnType<typeof initializeApp>;

try {
  firebaseApp = initializeApp({
    credential: applicationDefault(),
  });
} catch (e) {
  // nextjs hot reloading / rendering throws errors in firebase initializeApp
  // about being called more than once.
}

const userFromDbRow = (dbRow: UserDbRow, opts: {publicFilter: boolean, includeAdminUIFields?: boolean}): ApiUser => {
  // here we parse, validate, and return a polished POJO for the raw profile
  // data in the db.  doing this here lets us do things like apply upgrades
  // from old profile versions to new ones at read time, and proactively fail
  // if db profile data is corrupted.
  const profile = new UserProfile({ data: dbRow.profile })
  const profilePOJO = opts.publicFilter ? profile.toPOJOwithPublic() : profile.toPOJOwithPrivate();
  const user: ApiUser = {
    id: dbRow.id,
    email: dbRow.email,
    urlSlug: dbRow.url_slug || undefined,
    profile: profilePOJO,
    createdAt: dbRow.created_at_millis,
  };
  if (!opts.publicFilter && !opts.includeAdminUIFields) {
    // DRY_47693 signup code logic
    user.signupCodeName = dbRow.signup_code_name || ""
    if (!dbRow.signup_code_name) user.unsolicited = true;
  }
  if (dbRow.admin_status === "admin") user.isAdmin = true;
  if (dbRow.ban_status === "banned") user.isBanned = true;
  if (opts.includeAdminUIFields) {
    // signupCodeName was in here but is now just always returned
    user.lastFullPageLoad = dbRow.last_read_from_user || undefined
    user.lastWrite = dbRow.last_write_from_user || undefined
    user.updatedAt = dbRow.updated_at_millis
  }
  return user;
};

const generateRandomAvailableSlug = async() => {
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
    const dbRow = await knex("users").where("url_slug", slug).first() as UserDbRow | undefined;
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
  email,
}: {
  id: string;
  email: string;
}): Promise<ApiUser> => {
  const millis = new Date().getTime();
  let dbRow = await knex("users").where("id", id).first() as UserDbRow | undefined;
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
    return userFromDbRow(dbRow, {publicFilter:false})
  }
  // else, create new
  // DRY_r9639 user creation logic
  log.auth("no user found, potentially a new signup, autovivifying");
  const newSlug = await generateRandomAvailableSlug()
  const defaultProfile = new UserProfile();
  let columns: UserDbRow = {
    id,
    email: email,
    url_slug: newSlug,
    profile: defaultProfile.toPOJOwithPrivate(),
    //signup_code_name: codeInfo.codeName || null,
    signup_code_name: null, // XXX_PORTING
    created_at_millis: millis,
    updated_at_millis: millis,
    last_write_from_user: millis,
    last_read_from_user: millis,
    admin_status: null,
    ban_status: null,
  };
  dbRow = (await knex("users").insert(columns).returning("*"))[0] as UserDbRow;
  log.auth("created user", dbRow.id);
  // XXX_PORTING
  // setReqAuthentication(req, dbRow); // have to set this early here so track event can obtain the new auth user id
  // trackEventReqEvtOpts(req, trackingEvents.caSignup, {
  //   signupCodeName: codeInfo.codeName || "none",
  // });
  return userFromDbRow(dbRow, {publicFilter: false});
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
    secure: process.env.NEXT_PUBLIC_ENV_NAME !== "dev",
  });
  // DRY_r9725 session cookie name
  const sessionCookie = cookies.get(constants.sessionCookieName) || "";
  // console.log('sessionCookie', sessionCookie);
  if (!sessionCookie) return Promise.resolve(null);
  return (
    getAuth(firebaseApp)
      // note that "true" here in verifySessionCookie is important, it checks the
      // session hasn't been revoked via a password reset or direct admin call to
      // revoke it. it slows down auth, so, TODO: check session revocation less
      // often (on writes, on initial get /me, but not all the time - set this to
      // false as the default and add a more specific requireRevalidatedAuth
      // middleware that does the cookie check again with true, and use it on the
      // specific api methods that warrant it.
      .verifySessionCookie(sessionCookie, true)
      .then((decodedClaims) => {
        // console.log("decodedClaims",decodedClaims)
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
        return getOrCreateUser({
          id: decodedClaims.user_id,
          email: decodedClaims.email || "",
        });
      })
      .catch(() => {
        console.log("sessionCookie failed firebase verification")
        // TODO: delete cookie here?
        return null;
      })
  );
};

const getAuthFirebaseApp = () => getAuth(firebaseApp);

export { getAuthUser, userFromDbRow, getAuthFirebaseApp };
