import type { Methods } from "./index";
import { routeChangeStart, routeChangeComplete, matchRoute } from "../routes";

/**
 * Handle notifications of route change start & end events
 *
 * @param api AppShellHostAPI
 * @param payload AppRequestMethods["webRouterEvent"]["request"]
 * @returns Success
 */
export const webviewRouterEvent: Methods["webviewRouterEvent"] = async (
  api,
  payload
) => {
  const { event, url } = payload;
  const route = matchRoute(url);
  if (route) {
    if (event === "routeChangeStart") {
      routeChangeStart(api, route);
    } else if (event === "routeChangeComplete") {
      routeChangeComplete(api, route);
    }
  }
  return { success: true };
};

export default webviewRouterEvent;
