export const sessionCookieName = '_h3y_sess'

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
  payload: ApiUser
}

interface NewPostWrapper extends SuccessWrapper {
  payload: {
    user: ApiUser
    post: ApiPost
  }
}

interface NewProjectWrapper extends SuccessWrapper {
  payload: {
    user: ApiUser
    project: ApiProject
  }
}

interface PublicUserWrapper extends SuccessWrapper {
  payload: ApiUser
}

interface ValidateSignupCodeWrapper extends SuccessWrapper {
  payload: { code: string; name: string; active: boolean }
}

interface UrlMetaWrapper extends SuccessWrapper {
  payload: { urlMeta: ApiUrlMeta; url: string; }
}

export type {
  Wrapper,
  SuccessWrapper,
  EmptySuccessWrapper,
  ErrorWrapper,
  ErrorId,
  MeWrapper,
  NewPostWrapper,
  NewProjectWrapper,
  PublicUserWrapper,
  ValidateSignupCodeWrapper,
  UrlMetaWrapper,
}
