export const sessionCookieName = '_h3y_sess'

export const csrfCookieName = '_h3y_csrf' // DRY_86325 crsf cookie name. TODO: put this in a non-typescript shared const file?

export const signupCodes: { [key: string]: { active: boolean; name: string } } = {
  '1234': {
    active: true,
    name: 'devdefault',
  },
}

type GenericErrorId =
  | 'ERR_UNAUTHORIZED'
  | 'ERR_CSRF_TOKEN'
  | 'ERR_NOT_FOUND'
  | 'ERR_BAD_INPUT'
  | 'ERR_REMOTE_FETCH_FAILED'
  | 'ERR_CSRF_TOKEN'

type ErrorId = GenericErrorId

interface Wrapper {
  action: string
  status: number
  success: boolean
  payload?: POJO
  errorId?: ErrorId
  errorMsg?: string
}
interface SuccessWrapper extends Wrapper {
  action: string
  status: number
  success: true
  payload?: POJO
}
interface ErrorWrapper extends Wrapper {
  action: string
  status: number
  success: false
  errorId: ErrorId
  errorMsg: string
}

type EmptySuccessWrapper = SuccessWrapper

interface MeWrapper extends SuccessWrapper {
  action: 'getMe',
  payload: ApiUser
}

interface SaveProfileWrapper extends SuccessWrapper {
  action: 'saveProfile',
  payload: ApiUser
}

interface SavedPostWrapper extends SuccessWrapper {
  action: 'savePost',
  payload: {
    user: ApiUser
    post: ApiPost
  }
}

interface SavedProjectWrapper extends SuccessWrapper {
  action: 'saveProject',
  payload: {
    user: ApiUser
    project: ApiProject
  }
}

interface DeletePostWrapper extends SuccessWrapper {
  action: 'deletePost',
  payload: {
    user: ApiUser
    project: ApiProject
  }
}

interface DeleteProjectWrapper extends SuccessWrapper {
  action: 'deleteProject',
  payload: ApiUser
}

interface PublicUserWrapper extends SuccessWrapper {
  action: 'publicUser',
  payload: ApiUser
}

interface ValidateSignupCodeWrapper extends SuccessWrapper {
  action: 'validateSignupCode',
  payload: { code: string; name: string; active: boolean }
}

interface UrlMetaWrapper extends SuccessWrapper {
  action: 'getUrlMeta',
  payload: { urlMeta: ApiUrlMeta; url: string; }
}

interface SlugCheckWrapper extends SuccessWrapper {
  action: 'slugCheck',
  payload: {
    check: SlugCheck,
    currentSystem: string,
    currentUser?: string,
    source: 'system' | 'user',
    suggested?: string, // when source = system, the suggested user slug choice
  }
}

type WaitlistWrapper = EmptySuccessWrapper

export type {
  DeletePostWrapper,
  DeleteProjectWrapper,
  EmptySuccessWrapper,
  ErrorId,
  ErrorWrapper,
  MeWrapper,
  PublicUserWrapper,
  SaveProfileWrapper,
  SavedPostWrapper,
  SavedProjectWrapper,
  SlugCheckWrapper,
  SuccessWrapper,
  UrlMetaWrapper,
  ValidateSignupCodeWrapper,
  WaitlistWrapper,
  Wrapper,
}
