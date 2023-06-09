import log from './log'
import Cookies from 'js-cookie'
import type {
  Wrapper,
  ErrorWrapper,
  SuccessWrapper,
  ErrorId,
} from './apiConstants'
import * as constants from '@/lib/constants'

// endpoint is the scheme, domain, and port of the api backend
// XXX_PORTING setup var
const endpoint = 'http://localhost:3000' //process.env.REACT_APP_API_ENDPOINT;

const inBrowserContext = typeof window !== 'undefined'

type QueryParams = { [key: string]: string }

type FetchArgs = {
  action: string
  method?: string
  retries?: number
  queryParams?: QueryParams
  body?: POJO
  sessionCookie?: string
  asTestUser?: string
  expectErrorStatuses?: number[]
  expectErrorIds?: ErrorId[]
}

type ApiInfo = {
  errorId?: ErrorId
  errorMsg?: string
  fetchArgs?: FetchArgs
  responseWrapper?: Wrapper
  responseStatus?: number
  responseBody?: POJO
}

// build a complete api endpoint url given an api action name
const mkUrl = (action: string, queryParams?: QueryParams) => {
  const qs = new URLSearchParams(queryParams || {}).toString()
  return endpoint + '/api/' + action + (qs ? '?' + qs : '')
}

class ApiError extends Error {
  apiInfo?: ApiInfo

  constructor(
    message: string,
    {
      errorId,
      errorMsg,
      fetchArgs,
      responseWrapper,
      responseStatus,
      responseBody,
    }: ApiInfo
  ) {
    super(message)
    this.name = 'ApiError'
    this.apiInfo = {
      errorId,
      errorMsg,
      fetchArgs,
      responseWrapper,
      responseStatus,
      responseBody,
    }
  }
}

const wrapFetch = async (fetchArgs: FetchArgs): Promise<SuccessWrapper> => {
  // encapsulate fetch with a wrapper that:
  // - lets us use other http lib if we want
  // - only exposes the things we use
  // - traps and handles errors from the fetch call itself and from backend
  // responses we didn't expect (non-200 and so on) in a way we control
  // - returns just the json wrapper we care about in the normal case.
  // todo: support passing post data and etc
  fetchArgs.method = fetchArgs.method || 'GET'
  fetchArgs.retries = fetchArgs.retries || 0
  const {
    action,
    method,
    retries,
    body,
    sessionCookie,
    asTestUser,
    expectErrorIds,
    expectErrorStatuses,
  } = fetchArgs
  const queryParams = fetchArgs.queryParams || {}
  try {
    if (process.env.NODE_ENV === 'development') {
      if (asTestUser) {
        // XXX_PORTING setup var, setup test users
        queryParams.testKey = process.env.DEV_KEY_FOR_API_TEST_USERS || ''
        queryParams.asTestUser = asTestUser
      }
    }
    const url = mkUrl(action, queryParams)
    // i really don't know how to type the options for fetch... apparently it's
    // a RequestInit type but that type doesn't let me assign headers by
    // property name. sometimes typescript is just too much overhead or i'm not
    // good enough at it yet.
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const config: any = {
      method: method,
      headers: {
        Accept: 'application/json',
      },
    }
    if (sessionCookie) {
      config.headers['Cookie'] =
        constants.sessionCookieName + '=' + sessionCookie
    }
    if (method === 'POST') {
      config.headers['Content-Type'] = 'application/json'
      if (typeof body === 'object') {
        const bodyWithCsrfToken: POJO = { ...body }
        if (inBrowserContext) {
          bodyWithCsrfToken['csrf'] = Cookies.get('_csrf') || '' // XXX_PORTING changed name from _grac_csrf
        }
        config.body = JSON.stringify(bodyWithCsrfToken)
      } else {
        config.body = body
      }
    }
    log.api('fetching', action, queryParams, config)
    const res = await fetch(url, config)
    if (res.status !== 200) {
      let errorId, errorMsg
      let wrapper: ErrorWrapper | undefined
      try {
        // get the response json if present
        wrapper = (await res.json()) as ErrorWrapper
        errorId = wrapper.errorId
        errorMsg = wrapper.errorMsg
      } catch (e) {}
      const err = new ApiError('non-200 api response', {
        errorId,
        errorMsg,
        fetchArgs,
        responseWrapper: wrapper,
        responseStatus: res.status,
      })
      throw err
    }
    const wrapper = (await res.json()) as SuccessWrapper
    log.api('response:', action, wrapper)
    return wrapper
    // really not sure what typescript best practice is for catch blocks. you
    // seemingly can't specify anything but any on them, but "any" is bad?
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  } catch (e: any) {
    if (e.message.match(/fetch failed/)) {
      if (retries < 2) {
        fetchArgs.retries++
        log.api(`retrying failed fetch (${fetchArgs.retries}/2)`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return wrapFetch(fetchArgs)
      }
    }
    if (
      (e instanceof ApiError &&
        expectErrorIds &&
        e.apiInfo?.errorId &&
        expectErrorIds.includes(e.apiInfo?.errorId)) ||
      (expectErrorStatuses &&
        e.apiInfo?.responseStatus &&
        expectErrorStatuses.includes(e.apiInfo?.responseStatus))
    ) {
      log.api('got expected error', {
        action,
        status: e.apiInfo.responseStatus,
        errorId: e.apiInfo.errorId,
      })
      // even for expected errors, we throw because the promise in the normal
      // case has to return a successful response only. caller is still
      // expected to catch expected errors.
      throw e
    } else {
      // putting error:e instead of just e prevents console from spewing a
      // stack trace by default on everything including normal 401s when logged
      // out and such.
      log.api('error', action, { error: e })
      throw e
    }
  }
}

export { wrapFetch }

export type { FetchArgs, ApiInfo }
