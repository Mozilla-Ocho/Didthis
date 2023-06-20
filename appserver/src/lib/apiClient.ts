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
  SlugCheckWrapper,
  WaitlistWrapper,
} from './apiConstants'

// const getHealthCheck = async () => {
//   const payload = await wrapFetch({ action: 'health_check' })
//   return payload
// }

const getMe = async ({
  asTestUser,
  signupCode,
  expectUnauth,
  // this call accepts a sessionCookie value because in SSR, the
  // getServerSideProps function will call the api from the server, and needs
  // to pass the client's cookie value in. in browser context, the cookie
  // is sent automatically. likewise for csrf cookie.
  sessionCookie,
  csrfCookie,
}: {
  asTestUser?: string
  signupCode?: string | false
  expectUnauth?: boolean
  sessionCookie?: string
  csrfCookie?: string
}): Promise<MeWrapper> => {
  const fetchOpts: FetchArgs = {
    action: 'getMe',
    asTestUser,
    expectErrorIds: expectUnauth ? ['ERR_UNAUTHORIZED'] : undefined,
    queryParams: signupCode ? { signupCode } : undefined,
    sessionCookie,
    csrfCookie,
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

const saveProfile = async ({
  profile,
  userSlug,
}: {
  profile: ApiProfile;
  userSlug?: string,
}): Promise<MeWrapper> => {
  const wrapper = (await wrapFetch({
    action: "saveProfile",
    method: "POST",
    body: {profile,userSlug},
  })) as MeWrapper;
  return wrapper;
};

const getSlugCheck = async ({
  userSlug,
  provisionalName,
}: {
  userSlug: string
  provisionalName: string,
}) => {
  const qp: KvString = {}
  qp.userSlug = userSlug
  qp.provisionalName = provisionalName
  const wrapper = await wrapFetch({
    action: 'slugCheck',
    method: 'GET',
    queryParams: qp,
  }) as SlugCheckWrapper
  return wrapper
}

const saveWaitlist = async ({
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
  }) as WaitlistWrapper
  return wrapper
}

const apiClient = {
  deletePost,
  deleteProject,
  // getHealthCheck,
  getMe,
  getPublicUser,
  getSlugCheck,
  getUrlMeta,
  savePost,
  saveProfile,
  saveProject,
  saveWaitlist,
  sessionLogin,
  sessionLogout,
  validateSignupCode,
}

export default apiClient
