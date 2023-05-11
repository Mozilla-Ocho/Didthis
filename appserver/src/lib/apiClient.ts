import { wrapFetch } from './apiCore';
import type { POJO, MeWrapper } from './apiConstants';
import {UserProfile} from '@/lib/UserProfile';

const getHealthCheck = async () => {
  let payload = await wrapFetch({ action: 'health_check' });
  return payload;
};

const getMe = async (opts?: any) :Promise<MeWrapper> => {
  opts = opts || {}
  const {asTestUser,signupCode} = opts
  const fetchOpts: any = {
    action: 'me',
    asTestUser,
  };
  if (signupCode) fetchOpts.queryParams = {signupCode}
  let wrapper = await wrapFetch(fetchOpts) as MeWrapper;
  return wrapper
};

// XXX_PORTING change response shape
const postUserProfile = async ({
  userProfile,
  _testRawProfile,
  asTestUser,
}: {userProfile: UserProfile, _testRawProfile?: POJO, asTestUser?: string}) :Promise<MeWrapper> => {
  let body:POJO = {}
  body.profile = _testRawProfile || userProfile.toPOJO()
  let wrapper = await wrapFetch({
    action: 'profile',
    method: 'POST',
    body,
    asTestUser,
  }) as MeWrapper;
  return wrapper;
};

// XXX_PORTING change response shape
const getUrlSlug = async ({ checkSlug, asTestUser }: {checkSlug: string, asTestUser?:string}) => {
  const qp: any = {};
  if (typeof checkSlug === 'string') qp.checkSlug = checkSlug;
  let wrapper = await wrapFetch({
    action: 'url_slug',
    method: 'GET',
    queryParams: qp,
    asTestUser,
  });
  return wrapper;
};

// XXX_PORTING change response shape
const postUrlSlug = async ({ slug, asTestUser, fullResetForTestUser }:{slug?:string, asTestUser?:string, fullResetForTestUser?:boolean}) => {
  const body:any = {}
  if (fullResetForTestUser) {
    // the api backend only accepts the string "confirm" for this value
    body.fullResetForTestUser = fullResetForTestUser
  } else {
    body.slug = slug
  }
  let wrapper = await wrapFetch({
    action: 'url_slug',
    method: 'POST',
    body,
    asTestUser,
  });
  return wrapper;
};

// XXX_PORTING change response shape
const getUrlMeta = async ({ url, processor, asTestUser }:{url: string, processor: string, asTestUser?:string}) => {
  let wrapper = await wrapFetch({
    action: 'url_meta',
    method: 'GET',
    queryParams: {url, processor},
    asTestUser,
  });
  return wrapper;
};

// XXX_PORTING change response shape
const rawUnfurl = async ({ url }:{url:string}) => {
  let wrapper = await wrapFetch({
    action: 'raw_unfurl',
    method: 'GET',
    queryParams: {url},
  });
  return wrapper;
};

// XXX_PORTING change response shape
const postWaitlist = async ({ email, landing_page }:{email:string, landing_page:string}) => {
  let wrapper = await wrapFetch({
    action: 'waitlist',
    method: 'POST',
    body: { email, landing_page },
  });
  return wrapper;
}

// XXX_PORTING change response shape
const getWaitlist = async ({ id }:{id:string}) => {
  let wrapper = await wrapFetch({
    action: 'waitlist',
    method: 'GET',
    queryParams: {id},
  });
  return wrapper;
}

// XXX_PORTING change response shape
const sessionLogin = async ({ idToken }:{idToken:string}) => {
  let wrapper = await wrapFetch({
    action: 'sessionLogin',
    method: 'POST',
    body: { idToken },
  });
  return wrapper;
}

// XXX_PORTING change response shape
const sessionLogout = async () => {
  let wrapper = await wrapFetch({
    action: 'sessionLogout',
    method: 'POST',
    body: { },
  });
  return wrapper;
};

// XXX_PORTING change response shape
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
