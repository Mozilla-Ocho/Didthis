import Config from "./config";
import * as AppleAuthentication from "expo-apple-authentication";
import SetCookie from "set-cookie-parser";
import * as Storage from "./storage";

const { siteBaseUrl } = Config;
const apiLoginUrl = `${siteBaseUrl}/api/sessionLoginWithAppleId`;
const apiGetMeURL = `${siteBaseUrl}/api/getMe`;

const SESSION_COOKIE_NAME = "_h3y_sess";

export async function signinWithCredential(
  credential: AppleAuthentication.AppleAuthenticationCredential
) {
  await resetSignin();
  await Storage.setObject("APPLE_ID_CREDENTIAL", credential);

  const resp = await fetch(apiLoginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });

  if (resp.status !== 201) {
    const body = await resp.text();
    throw new Error(`Sign-in failed - ${resp.status} - ${body}`);
  }

  const sessionCookie = await extractSessionCookie(resp);
  if (!sessionCookie) {
    throw new Error("Sign-in failed - no session cookie");
  }
  await Storage.setItem("AUTH_SESSION_COOKIE", sessionCookie);

  const apiUser = await fetchSignedInUser();
  if (!apiUser) {
    throw new Error("Sign-in failed - no signed in user");
  }
  await Storage.setObject("SIGNED_IN_USER", apiUser);

  return apiUser;
}

export async function signinWithSession(
  sessionCookie: string,
) {
  await resetSignin();
  await Storage.setItem("AUTH_SESSION_COOKIE", sessionCookie);
  const apiUser = await fetchSignedInUser();
  if (!apiUser) {
    throw new Error("Sign-in failed - no signed in user");
  }
  await Storage.setObject("SIGNED_IN_USER", apiUser);

  return apiUser;
}

export async function resetSignin() {
  const storageKeys: Storage.StorageKey[] = [
    "APPLE_ID_CREDENTIAL",
    "AUTH_SESSION_COOKIE",
    "SIGNED_IN_USER",
  ];
  for (const key of storageKeys) {
    await Storage.removeItem(key);
  }
}

export async function extractSessionCookie(resp: Response) {
  // See: https://github.com/nfriedly/set-cookie-parser#usage-in-react-native-and-with-some-other-fetch-implementations
  const cookieHeader = resp.headers.get("set-cookie");
  const splitCookieHeader = SetCookie.splitCookiesString(cookieHeader);
  const cookies = SetCookie.parse(splitCookieHeader);
  for (const cookie of cookies) {
    if (SESSION_COOKIE_NAME === cookie.name) {
      return cookie.value;
    }
  }
  return null;
}

export async function fetchSignedInUser() {
  const resp = await fetch(apiGetMeURL, {
    ...(await authOptions()),
    method: "GET",
  });

  if (resp.status !== 200) {
    const body = await resp.text();
    throw new Error(`User fetch failed - ${resp.status} - ${body}`);
  }

  const result = await resp.json();
  return result.payload;
}

async function authOptions(): Promise<RequestInit> {
  const sessionCookie = await Storage.getItem("AUTH_SESSION_COOKIE");
  if (!sessionCookie) {
    throw new Error("No session cookie");
  }
  return {
    credentials: "omit",
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${sessionCookie}` },
  };
}