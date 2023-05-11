import log from "./log";
import Cookies from "js-cookie";
import type { Wrapper, ErrorId, POJO } from "./apiConstants";

// endpoint is the scheme, domain, and port of the api backend
// XXX_PORTING setup var
const endpoint = "http://localhost:3000"; //process.env.REACT_APP_API_ENDPOINT;

const inBrowserContext = typeof window !== "undefined";

type QueryParams = { [key: string]: string };

type FetchArgs = {
  action: string;
  method?: string;
  retries?: number;
  queryParams?: QueryParams;
  body?: POJO;
  asTestUser?: string;
};

type ApiInfo = {
  errorId: ErrorId;
  errorMsg: string;
  fetchArgs?: FetchArgs;
  responseWrapper?: Wrapper;
  responseStatus?: number;
  responseBody?: POJO;
};

// build a complete api endpoint url given an api action name
const mkUrl = (action: string, queryParams?: QueryParams) => {
  const qs = new URLSearchParams(queryParams || {}).toString();
  return endpoint + "/api/" + action + (qs ? "?" + qs : "");
};

class ApiError extends Error {
  apiInfo?: ApiInfo;

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
    super(message);
    this.name = "ApiError";
    this.apiInfo = {
      errorId,
      errorMsg,
      fetchArgs,
      responseWrapper,
      responseStatus,
      responseBody,
    };
  }
}

const wrapFetch = async (fetchArgs: FetchArgs): Promise<Wrapper> => {
  // encapsulate fetch with a wrapper that:
  // - lets us use other http lib if we want
  // - only exposes the things we use
  // - traps and handles errors from the fetch call itself and from backend
  // responses we didn't expect (non-200 and so on) in a way we control
  // - returns just the json wrapper we care about in the normal case.
  // todo: support passing post data and etc
  fetchArgs.method = fetchArgs.method || "GET";
  fetchArgs.retries = fetchArgs.retries || 0;
  let { action, method, retries, queryParams, body, asTestUser } = fetchArgs;
  queryParams = queryParams || {};
  try {
    if (process.env.NODE_ENV === "development") {
      if (asTestUser) {
        // XXX_PORTING setup var, setup test users
        queryParams.testKey = process.env.DEV_KEY_FOR_API_TEST_USERS || "";
        queryParams.asTestUser = asTestUser;
      }
    }
    const url = mkUrl(action, queryParams);
    const config: any = {
      method: method,
      headers: {
        Accept: "application/json",
      },
    };
    if (method === "POST") {
      config.headers["Content-Type"] = "application/json";
      if (typeof body === "object") {
        let bodyWithCsrfToken: POJO = { ...body };
        if (inBrowserContext) {
          bodyWithCsrfToken["csrf"] = Cookies.get("_csrf") || ""; // XXX_PORTING changed name from _grac_csrf
        }
        config.body = JSON.stringify(bodyWithCsrfToken);
      } else {
        config.body = body;
      }
    }
    log.api("fetching", action, queryParams, config);
    let res = await fetch(url, config);
    let wrapper = null;
    if (res.status !== 200) {
      let errorId, errorMsg;
      try {
        // get the response json if present
        wrapper = await res.json();
        errorId = wrapper.errorId;
        errorMsg = wrapper.errorMsg;
      } catch (e) {}
      const err = new ApiError("non-200 api response", {
        errorId,
        errorMsg,
        fetchArgs,
        responseWrapper: wrapper,
        responseStatus: res.status,
      });
      //log.api('non 200 response:', wrapper);
      throw err;
    }
    wrapper = await res.json();
    log.api("response:", action, wrapper);
    return wrapper;
  } catch (e: any) {
    if (e.message.match(/fetch failed/)) {
      if (retries < 2) {
        fetchArgs.retries++;
        log.api(`retrying failed fetch (${fetchArgs.retries}/2)`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return wrapFetch(fetchArgs);
      }
    }
    // putting error:e instead of just e prevents console from spewing a stack
    // trace by default on everything including normal 401s when logged out and
    // such.
    log.api("error", { error: e });
    throw e;
  }
};

export { wrapFetch };

export type { FetchArgs, ApiInfo };
