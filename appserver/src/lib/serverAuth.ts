import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { UserProfile } from "@/lib/UserProfile";
import type { User } from "@/lib/apiConstants";
import Cookies from "cookies";
import knex from "@/knex";
import log from "@/lib/log";

const firebaseApp = initializeApp({
  credential: applicationDefault(),
});

const userFromDbRow = (dbRow: any, opts?: any): User => {
  // here we parse, validate, and return a polished POJO for the raw profile
  // data in the db.  doing this here lets us do things like apply upgrades
  // from old profile versions to new ones at read time, and proactively fail
  // if db profile data is corrupted.
  const profilePOJO = new UserProfile({ data: dbRow.profile }).toPOJO();
  const user: User = {
    id: dbRow.id,
    email: dbRow.email,
    urlSlug: dbRow.url_slug, // nullable
    profile: profilePOJO,
    createdAt: parseInt(dbRow.created_at_millis, 10),
    signupCodeName: dbRow.signup_code_name || "",
  };
  // DRY_47693 signup code logic
  if (!dbRow.signup_code_name) user.unsolicited = true;
  if (dbRow.admin_status === "admin") user.isAdmin = true;
  if (dbRow.ban_status === "banned") user.isBanned = true;
  if (opts && opts.includeAdminUIFields) {
    // signupCodeName was in here but is now just always returned
    user.lastFullPageLoad =
      dbRow.last_read_from_user && parseInt(dbRow.last_read_from_user, 10);
    user.lastWrite =
      dbRow.last_write_from_user && parseInt(dbRow.last_write_from_user, 10);
    user.updatedAt =
      dbRow.updated_at_millis && parseInt(dbRow.updated_at_millis, 10);
  }
  return user;
};

const getOrCreateUser = async ({
  id,
  email,
}: {
  id: string;
  email: string;
}): Promise<User> => {
  const millis = new Date().getTime();
  let dbRow: any = await knex("users").where("id", id).first();
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
    return dbRow;
  }
  // else, create new
  // DRY_r9639 user creation logic
  log.auth("no user found, potentially a new signup, autovivifying");
  const defaultProfile = new UserProfile();
  let columns = {
    id,
    is_firebase: true,
    email: email,
    url_slug: null,
    profile: defaultProfile.toJSON(),
    //signup_code_name: codeInfo.codeName || null,
    signup_code_name: null, // XXX_PORTING
    created_at_millis: millis,
    updated_at_millis: millis,
    last_write_from_user: millis,
    last_read_from_user: millis,
  };
  dbRow = (await knex("users").insert(columns).returning("*"))[0];
  log.auth("created user", dbRow.id);
  // XXX_PORTING
  // setReqAuthentication(req, dbRow); // have to set this early here so track event can obtain the new auth user id
  // trackEventReqEvtOpts(req, trackingEvents.caSignup, {
  //   signupCodeName: codeInfo.codeName || "none",
  // });
  return userFromDbRow(dbRow);
};

// reads the Authorization header for the bearer token and validates it, looks
// up the user record if any
const getAuthUser = (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | null> => {
  const cookies = new Cookies(req, res);
  // DRY_r9725 session cookie name
  const sessionCookie = cookies.get("_grac_sess") || "";
  // console.log('sessionCookie', sessionCookie);
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
          email: decodedClaims.email || '',
        });
      })
      .catch(() => {
        // TODO: delete cookie here?
        return null;
      })
  );
};

export { getAuthUser, userFromDbRow };
