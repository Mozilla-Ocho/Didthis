type GenericErrorId =
  | 'ERR_UNAUTHORIZED'
  | 'ERR_CSRF_TOKEN'
  | 'ERR_NOT_FOUND'
  | 'ERR_BAD_INPUT'

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

interface PublicUserWrapper extends SuccessWrapper {
  payload: ApiUser
}

interface ValidateSignupCodeWrapper extends SuccessWrapper {
  payload: { code: string; name: string; active: boolean }
}

export type {
  Wrapper,
  SuccessWrapper,
  ErrorWrapper,
  ErrorId,
  MeWrapper,
  NewPostWrapper,
  PublicUserWrapper,
  ValidateSignupCodeWrapper,
  EmptySuccessWrapper,
}
