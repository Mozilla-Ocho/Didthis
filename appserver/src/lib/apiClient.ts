import { wrapFetch } from './apiCore'
import type { FetchArgs } from '@/lib/apiCore'
import type {
  MeWrapper,
  SavedProjectWrapper,
  PublicUserWrapper,
  ValidateSignupCodeWrapper,
  EmptySuccessWrapper,
  SavedPostWrapper,
  UrlMetaWrapper,
} from './apiConstants'

const getHealthCheck = async () => {
  const payload = await wrapFetch({ action: 'health_check' })
  return payload
}

const getMe = async ({
  asTestUser,
  signupCode,
  expectUnauth,
  sessionCookie,
}: {
  asTestUser?: string
  signupCode?: string | false
  expectUnauth?: boolean
  sessionCookie?: string
}): Promise<MeWrapper> => {
  const fetchOpts: FetchArgs = {
    action: 'me',
    asTestUser,
    expectErrorIds: expectUnauth ? ['ERR_UNAUTHORIZED'] : undefined,
    queryParams: signupCode ? { signupCode } : undefined,
    sessionCookie,
  }
  const wrapper = (await wrapFetch(fetchOpts)) as MeWrapper
  return wrapper
}

const getPublicUser = async ({
  urlSlug,
}: {
  urlSlug: string
}): Promise<PublicUserWrapper> => {
  const fetchOpts: FetchArgs = {
    action: 'getUser',
    queryParams: { urlSlug },
  }
  const wrapper = (await wrapFetch(fetchOpts)) as PublicUserWrapper
  return wrapper
}

const sessionLogin = async ({
  idToken,
}: {
  idToken: string
}): Promise<EmptySuccessWrapper> => {
  const wrapper = (await wrapFetch({
    action: 'sessionLogin',
    method: 'POST',
    body: { idToken },
  })) as EmptySuccessWrapper
  return wrapper
}

const sessionLogout = async (): Promise<EmptySuccessWrapper> => {
  const wrapper = (await wrapFetch({
    action: 'sessionLogout',
    method: 'POST',
  })) as EmptySuccessWrapper
  return wrapper
}

const validateSignupCode = async ({
  code,
}: {
  code: string
}): Promise<ValidateSignupCodeWrapper> => {
  const wrapper = (await wrapFetch({
    action: 'validateSignupCode',
    method: 'GET',
    queryParams: { code },
  })) as ValidateSignupCodeWrapper
  return wrapper
}

const savePost = async ({
  post,
}: {
  post: ApiPost
}): Promise<SavedPostWrapper> => {
  const wrapper = (await wrapFetch({
    action: 'savePost',
    method: 'POST',
    body: { post },
  })) as SavedPostWrapper
  return wrapper
}

const saveProject = async ({
  project,
}: {
  project: ApiProject
}): Promise<SavedProjectWrapper> => {
  const wrapper = (await wrapFetch({
    action: 'saveProject',
    method: 'POST',
    body: { project },
  })) as SavedProjectWrapper
  return wrapper
}

const deletePost = async ({
  postId,
  projectId,
}: {
  postId: ApiPostId
  projectId: ApiProjectId
}): Promise<SavedProjectWrapper> => {
  const wrapper = (await wrapFetch({
    action: 'deletePost',
    method: 'POST',
    body: { postId,projectId },
  })) as SavedProjectWrapper
  return wrapper
}

const deleteProject = async ({
  projectId,
}: {
  projectId: ApiProjectId
}): Promise<MeWrapper> => {
  const wrapper = (await wrapFetch({
    action: 'deleteProject',
    method: 'POST',
    body: { projectId },
  })) as MeWrapper
  return wrapper
}

const getUrlMeta = async ({
  url,
}: {
  url: string
}): Promise<UrlMetaWrapper> => {
  const wrapper = (await wrapFetch({
    action: 'getUrlMeta',
    method: 'POST',
    body: { url },
    expectErrorIds:['ERR_BAD_INPUT','ERR_REMOTE_FETCH_FAILED'],
  })) as UrlMetaWrapper
  return wrapper
}

// const postUserProfile = async ({
//   profile,
// }: {
//   profile: ApiProfile;
// }): Promise<MeWrapper> => {
//   let wrapper = (await wrapFetch({
//     action: "profile",
//     method: "POST",
//     body: {profile},
//   })) as MeWrapper;
//   return wrapper;
// };

// XXX_PORTING change response shape
const getUrlSlug = async ({
  checkSlug,
  asTestUser,
}: {
  checkSlug: string
  asTestUser?: string
}) => {
  const qp: KvString = {}
  if (typeof checkSlug === 'string') qp.checkSlug = checkSlug
  const wrapper = await wrapFetch({
    action: 'url_slug',
    method: 'GET',
    queryParams: qp,
    asTestUser,
  })
  return wrapper
}

// XXX_PORTING change response shape
const postUrlSlug = async ({
  slug,
  asTestUser,
  fullResetForTestUser,
}: {
  slug?: string
  asTestUser?: string
  fullResetForTestUser?: boolean
}) => {
  const body: POJO = {}
  if (fullResetForTestUser) {
    // the api backend only accepts the string "confirm" for this value
    body.fullResetForTestUser = fullResetForTestUser
  } else {
    body.slug = slug
  }
  const wrapper = await wrapFetch({
    action: 'url_slug',
    method: 'POST',
    body,
    asTestUser,
  })
  return wrapper
}

// XXX_PORTING change response shape
const rawUnfurl = async ({ url }: { url: string }) => {
  const wrapper = await wrapFetch({
    action: 'raw_unfurl',
    method: 'GET',
    queryParams: { url },
  })
  return wrapper
}

// XXX_PORTING change response shape
const postWaitlist = async ({
  email,
  landing_page,
}: {
  email: string
  landing_page: string
}) => {
  const wrapper = await wrapFetch({
    action: 'waitlist',
    method: 'POST',
    body: { email, landing_page },
  })
  return wrapper
}

// XXX_PORTING change response shape
const getWaitlist = async ({ id }: { id: string }) => {
  const wrapper = await wrapFetch({
    action: 'waitlist',
    method: 'GET',
    queryParams: { id },
  })
  return wrapper
}

const apiClient = {
  getHealthCheck,
  getMe,
  getPublicUser,
  // postUserProfile,
  savePost,
  saveProject,
  deletePost,
  deleteProject,
  getUrlSlug,
  postUrlSlug,
  getUrlMeta,
  rawUnfurl,
  postWaitlist,
  getWaitlist,
  sessionLogin,
  sessionLogout,
  validateSignupCode,
}

export default apiClient
