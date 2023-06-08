import { wrapFetch } from "./apiCore";
import type { FetchArgs} from "@/lib/apiCore"
import type { MeWrapper, PublicUserWrapper, ValidateSignupCodeWrapper, EmptySuccessWrapper } from "./apiConstants";

const getHealthCheck = async () => {
  let payload = await wrapFetch({ action: "health_check" });
  return payload;
};

const getMe = async ({
  asTestUser,
  signupCode,
  expectUnauth,
  sessionCookie,
}:{
  asTestUser?: string;
  signupCode?: string | false;
  expectUnauth?: boolean;
  sessionCookie?: string;
}): Promise<MeWrapper> => {
  const fetchOpts: FetchArgs = {
    action: "me",
    asTestUser,
    expectErrorIds: expectUnauth ? ["ERR_UNAUTHORIZED"] : undefined,
    queryParams: signupCode ? { signupCode } : undefined,
    sessionCookie,
  };
  let wrapper = (await wrapFetch(fetchOpts)) as MeWrapper;
  return wrapper;
};

const getPublicUser = async ({
  urlSlug,
}:{
  urlSlug: string;
}): Promise<PublicUserWrapper> => {
  const fetchOpts: FetchArgs = {
    action: "getUser",
    queryParams: { urlSlug },
  };
  let wrapper = (await wrapFetch(fetchOpts)) as PublicUserWrapper;
  return wrapper;
};

const sessionLogin = async ({ idToken }: { idToken: string }):Promise<EmptySuccessWrapper> => {
  let wrapper = await wrapFetch({
    action: "sessionLogin",
    method: "POST",
    body: { idToken },
  }) as EmptySuccessWrapper
  return wrapper;
};

const sessionLogout = async ():Promise<EmptySuccessWrapper> => {
  let wrapper = await wrapFetch({
    action: "sessionLogout",
    method: "POST",
  }) as EmptySuccessWrapper
  return wrapper;
};

const validateSignupCode = async ({ code }: { code: string }): Promise<ValidateSignupCodeWrapper> => {
  let wrapper = await wrapFetch({
    action: "validateSignupCode",
    method: "GET",
    queryParams: { code },
  }) as ValidateSignupCodeWrapper;
  return wrapper;
};

// XXX_PORTING change response shape
// const postUserProfile = async ({
//   userProfile,
//   _testRawProfile,
//   asTestUser,
// }: {
//   userProfile: UserProfile;
//   _testRawProfile?: POJO;
//   asTestUser?: string;
// }): Promise<MeWrapper> => {
//   let body: POJO = {};
//   body.profile = _testRawProfile || userProfile.toPOJOwithPrivate();
//   let wrapper = (await wrapFetch({
//     action: "profile",
//     method: "POST",
//     body,
//     asTestUser,
//   })) as MeWrapper;
//   return wrapper;
// };

// XXX_PORTING change response shape
const getUrlSlug = async ({
  checkSlug,
  asTestUser,
}: {
  checkSlug: string;
  asTestUser?: string;
}) => {
  const qp: any = {};
  if (typeof checkSlug === "string") qp.checkSlug = checkSlug;
  let wrapper = await wrapFetch({
    action: "url_slug",
    method: "GET",
    queryParams: qp,
    asTestUser,
  });
  return wrapper;
};

// XXX_PORTING change response shape
const postUrlSlug = async ({
  slug,
  asTestUser,
  fullResetForTestUser,
}: {
  slug?: string;
  asTestUser?: string;
  fullResetForTestUser?: boolean;
}) => {
  const body: any = {};
  if (fullResetForTestUser) {
    // the api backend only accepts the string "confirm" for this value
    body.fullResetForTestUser = fullResetForTestUser;
  } else {
    body.slug = slug;
  }
  let wrapper = await wrapFetch({
    action: "url_slug",
    method: "POST",
    body,
    asTestUser,
  });
  return wrapper;
};

// XXX_PORTING change response shape
const getUrlMeta = async ({
  url,
  processor,
  asTestUser,
}: {
  url: string;
  processor: string;
  asTestUser?: string;
}) => {
  let wrapper = await wrapFetch({
    action: "url_meta",
    method: "GET",
    queryParams: { url, processor },
    asTestUser,
  });
  return wrapper;
};

// XXX_PORTING change response shape
const rawUnfurl = async ({ url }: { url: string }) => {
  let wrapper = await wrapFetch({
    action: "raw_unfurl",
    method: "GET",
    queryParams: { url },
  });
  return wrapper;
};

// XXX_PORTING change response shape
const postWaitlist = async ({
  email,
  landing_page,
}: {
  email: string;
  landing_page: string;
}) => {
  let wrapper = await wrapFetch({
    action: "waitlist",
    method: "POST",
    body: { email, landing_page },
  });
  return wrapper;
};

// XXX_PORTING change response shape
const getWaitlist = async ({ id }: { id: string }) => {
  let wrapper = await wrapFetch({
    action: "waitlist",
    method: "GET",
    queryParams: { id },
  });
  return wrapper;
};

const apiClient = {
  getHealthCheck,
  getMe,
  getPublicUser,
  // postUserProfile,
  getUrlSlug,
  postUrlSlug,
  getUrlMeta,
  rawUnfurl,
  postWaitlist,
  getWaitlist,
  sessionLogin,
  sessionLogout,
  validateSignupCode,
};

export default apiClient;
