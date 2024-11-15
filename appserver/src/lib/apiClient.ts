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
  SuccessWrapper,
  SessionLoginAsTrialUserWrapper,
  ClaimTrialUserWrapper,
  SessionLoginWithAppleIdWrapper,
  DisconnectDiscordWrapper,
  ExportAccountWrapper,
} from './apiConstants'
import { AppleAuthenticationCredential } from "./appleAuth";

// const getHealthCheck = async () => {
//   const payload = await wrapFetch({ action: 'health_check' })
//   return payload
// }

const getMe = async ({
  asTestUser,
  signupCode,
  expectUnauth,
  idToken,
  appPlatform,
  authMethod,
}: {
  asTestUser?: string
  signupCode?: string | false
  expectUnauth?: boolean
  idToken?: string
  appPlatform?: AppPlatformType
  authMethod?: AuthMethodType
}): Promise<MeWrapper> => {
  const qparams : { signupCode?: string, appPlatform?: AppPlatformType, authMethod?: AuthMethodType } = {}
  if (signupCode) qparams.signupCode = signupCode
  // DRY_27098 tracking app platform in user signups
  if (appPlatform) qparams.appPlatform = appPlatform
  if (authMethod) qparams.authMethod = authMethod
  const fetchOpts: FetchArgs = {
    action: 'getMe',
    asTestUser,
    expectErrorIds: expectUnauth ? ['ERR_UNAUTHORIZED'] : undefined,
    queryParams: qparams,
  }
  if (idToken) {
    // for our wonky handling for firebase idTokens that generate session
    // cookies, when idToken is present (as is the case after firebase ui sign
    // in completes), send it in the request body and set method to POST. auth
    // logic on the server will use this to retreive or create the user and set
    // a session cookie. otherwise, session cookie is expected.
    fetchOpts.method = 'POST'
    fetchOpts.body = {idToken}
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

const deleteAccount = async (): Promise<EmptySuccessWrapper> => {
  const wrapper = (await wrapFetch({
    action: 'deleteAccount',
    method: 'POST',
  })) as EmptySuccessWrapper
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

const flagUser = async({
  userId,
  flagged,
}:{
  userId: ApiUserId,
  flagged: boolean,
}) => {
  // this is an admin api method
  const wrapper = await wrapFetch({
    action: 'flagUser',
    method: 'POST',
    body: { userId, flagged },
  }) as EmptySuccessWrapper
  return wrapper
}

const sessionLoginWithAppleId = async({
  credential,
  appPlatform,
}: {
  credential: AppleAuthenticationCredential
  appPlatform?: AppPlatformType
}) => {
  const queryParams : { appPlatform?: AppPlatformType } = {}
  // DRY_27098 tracking app platform in user signups
  if (appPlatform) queryParams.appPlatform = appPlatform
  const wrapper = await wrapFetch({
    action: 'sessionLoginWithAppleId',
    method: 'POST',
    body: { credential: credential as JSONABLE },
    queryParams,
  }) as SessionLoginWithAppleIdWrapper
  return wrapper
}

const sessionLoginAsTrialUser = async ({
  signupCode,
  appPlatform,
}: {
  signupCode: string
  appPlatform?: AppPlatformType
}) => {
  const queryParams : { appPlatform?: AppPlatformType } = {}
  // DRY_27098 tracking app platform in user signups
  if (appPlatform) queryParams.appPlatform = appPlatform
  const wrapper = await wrapFetch({
    action: 'sessionLoginAsTrialUser',
    method: 'POST',
    body: { signupCode },
    queryParams,
  }) as SessionLoginAsTrialUserWrapper
  return wrapper
}

const claimTrialUser = async ({
  claimIdToken,
}: {
  claimIdToken: string
}) => {
  const wrapper = await wrapFetch({
    action: 'claimTrialUser',
    method: 'POST',
    body: { claimIdToken },
  }) as ClaimTrialUserWrapper
  return wrapper
}

const disconnectDiscord = async (): Promise<DisconnectDiscordWrapper> => {
  const wrapper = (await wrapFetch({
    action: 'disconnectDiscord',
    method: 'POST',
  })) as DisconnectDiscordWrapper
  return wrapper
}

const exportAccount = async (): Promise<ExportAccountWrapper> => {
  const wrapper = (await wrapFetch({
    action: 'exportAccount',
    method: 'POST',
  })) as ExportAccountWrapper
  return wrapper
}

const apiClient = {
  sessionLoginWithAppleId,
  sessionLoginAsTrialUser,
  claimTrialUser,
  deleteAccount,
  deletePost,
  deleteProject,
  disconnectDiscord,
  exportAccount,
  // getHealthCheck,
  getMe,
  getPublicUser,
  getSlugCheck,
  getUrlMeta,
  savePost,
  saveProfile,
  saveProject,
  saveWaitlist,
  sessionLogout,
  validateSignupCode,
  flagUser,
}

export type ApiClient = typeof apiClient;

export default apiClient
