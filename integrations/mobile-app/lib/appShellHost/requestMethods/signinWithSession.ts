import type { Methods } from "./index";
import * as SiteAPI from "../../siteApi";

export const signinWithSession: Methods["signinWithSession"] = async (
  api,
  payload
) => {
  const { sessionCookie, authMethod = "email" } = payload;
  await SiteAPI.signinWithSession(sessionCookie);
  api.navigation.navigate("WebApp", {
    authMethod,
    resetWebViewAfter: Date.now(),
  });
  return { success: true };
};

export default signinWithSession;
