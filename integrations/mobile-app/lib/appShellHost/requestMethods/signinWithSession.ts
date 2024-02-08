import type { Methods } from "./index";
import * as SiteAPI from "../../siteApi";

export const signinWithSession: Methods["signinWithSession"] = async (
  api,
  payload
) => {
  const { sessionCookie } = payload;
  await SiteAPI.signinWithSession(sessionCookie);
  api.navigation.navigate("WebApp", {
    resetWebViewAfter: Date.now(),
  });
  return { success: true };
};

export default signinWithSession;
