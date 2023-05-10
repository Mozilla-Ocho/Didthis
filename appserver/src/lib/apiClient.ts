import { wrapFetch } from './apiCore';

const getHealthCheck = async () => {
  let payload = await wrapFetch({ action: 'health_check' });
  return payload;
};

const getMe = async (opts?: any) => {
  opts = opts || {}
  const {asTestUser,signupCode} = opts
  const fetchOpts: any = {
    action: 'me',
    asTestUser,
  };
  if (signupCode) fetchOpts.queryParams = {signupCode}
  let payload = await wrapFetch(fetchOpts);
  return payload.user;
};

const postUserProfile = async ({
  userProfile,
  _testRawProfile,
  fullResetForTestUser,
  asTestUser,
}: {userProfile?: any, _testRawProfile?: any, fullResetForTestUser?: boolean, asTestUser?: string}) => {
  let body:any = {}
  if (fullResetForTestUser) {
    // the api backend only accepts the string "confirm" for this value
    body.fullResetForTestUser = fullResetForTestUser
  } else {
    body.profile = _testRawProfile || userProfile.toPOJO()
  }
  let payload = await wrapFetch({
    action: 'profile',
    method: 'POST',
    body,
    asTestUser,
  });
  return payload.user;
};

const getUrlSlug = async ({ checkSlug, asTestUser }: {checkSlug: string, asTestUser?:string}) => {
  const qp: any = {};
  if (typeof checkSlug === 'string') qp.checkSlug = checkSlug;
  let payload = await wrapFetch({
    action: 'url_slug',
    method: 'GET',
    queryParams: qp,
    asTestUser,
  });
  return payload;
};

const postUrlSlug = async ({ slug, asTestUser, fullResetForTestUser }:{slug?:string, asTestUser?:string, fullResetForTestUser?:boolean}) => {
  const body:any = {}
  if (fullResetForTestUser) {
    // the api backend only accepts the string "confirm" for this value
    body.fullResetForTestUser = fullResetForTestUser
  } else {
    body.slug = slug
  }
  let payload = await wrapFetch({
    action: 'url_slug',
    method: 'POST',
    body,
    asTestUser,
  });
  return payload.user;
};

const getUrlMeta = async ({ url, processor, asTestUser }:{url: string, processor: string, asTestUser?:string}) => {
  let payload = await wrapFetch({
    action: 'url_meta',
    method: 'GET',
    queryParams: {url, processor},
    asTestUser,
  });
  return payload;
};

const rawUnfurl = async ({ url }:{url:string}) => {
  let payload = await wrapFetch({
    action: 'raw_unfurl',
    method: 'GET',
    queryParams: {url},
  });
  return payload;
};

const postWaitlist = async ({ email, landing_page }:{email:string, landing_page:string}) => {
  let payload = await wrapFetch({
    action: 'waitlist',
    method: 'POST',
    body: { email, landing_page },
  });
  return payload;
}

const getWaitlist = async ({ id }:{id:string}) => {
  let payload = await wrapFetch({
    action: 'waitlist',
    method: 'GET',
    queryParams: {id},
  });
  return payload;
}

const sessionLogin = async ({ idToken }:{idToken:string}) => {
  let payload = await wrapFetch({
    action: 'sessionLogin',
    method: 'POST',
    body: { idToken },
  });
  return payload;
}

const sessionLogout = async () => {
  let payload = await wrapFetch({
    action: 'sessionLogout',
    method: 'POST',
    body: { },
  });
  return payload;
};

const validateSignupCode = async ({code}:{code:string}) => {
  let payload = await wrapFetch({
    action: 'validateSignupCode',
    method: 'GET',
    queryParams: {code},
  });
  return payload;
};

const apiClient = {
  getHealthCheck,
  getMe,
  postUserProfile,
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
