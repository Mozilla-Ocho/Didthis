import AppShellHostAPI from "../api";
import type { Methods } from "./index";

/**
 * Handle the start of a route change in the web content app
 *
 * @param api AppShellHostAPI
 * @param route MatchRouteResult
 */
function routeChangeStart(api: AppShellHostAPI, route: MatchRouteResult) {
  api.set("loading", true);
  api.set("webContentRouteChanging", true);
}

/**
 * Handle the completion of a route change in the web content app
 *
 * @param api AppShellHostAPI
 * @param route MatchRouteResult
 */
function routeChangeComplete(api: AppShellHostAPI, route: MatchRouteResult) {
  api.set("loading", false);
  api.set("webContentRouteChanging", false);

  const showBottomNav = !hideBottomNavRoutes.includes(route?.name);
  api.set("bottomNav", { show: showBottomNav });
  api.set("topNav", { show: false });
}

// List of routes for which the bottom nav bar will be hidden
const hideBottomNavRoutes: RoutePatternName[] = [
  "userEdit",
  "postNew",
  "postEdit",
  "projectEdit",
  "projectNew",
];

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

/**
 * Utility to match route URL and extract parameters
 *
 * @param url string
 * @returns MatchRouteResult
 */
function matchRoute(url: string): MatchRouteResult | undefined {
  for (const [name, pattern] of routePatterns) {
    const match = pattern.exec(url);
    if (!match) continue;
    return { name, params: match.groups || {} };
  }
}

// Quick & dirty regexes to detect next.js routes and parameters
const userRoute = `/user/(?<user>[^/]+)`;
const projectRoute = `${userRoute}/project/(?<project>[^/]+)`;
const postRoute = `${projectRoute}/post/(?<post>[^/]+)`;
const routePatternsSource = [
  ["index", `^/$`],
  ["userEdit", `^${userRoute}/edit$`],
  ["postNew", `^${userRoute}/post$`],
  ["postNew", `^${userRoute}/post\\?projectId=(?<project>.*)$`],
  ["postEdit", `^${postRoute}/edit`],
  ["postView", `^${postRoute}$`],
  ["projectNew", `^${userRoute}/project/new$`],
  ["projectEdit", `^${projectRoute}/edit$`],
  ["projectView", `^${projectRoute}$`],
  ["userView", `^${userRoute}$`],
] as const;

type RoutePatternName = (typeof routePatternsSource)[number][0];

const routePatterns: [RoutePatternName, RegExp][] = routePatternsSource.map(
  ([name, reSrc]) => [name, new RegExp(reSrc)]
);

type MatchRouteResult = {
  name: RoutePatternName;
  // TODO: params could be made name-specific 🤷‍♂️
  params: {
    user?: string;
    project?: string;
    post?: string;
  };
};

export default webviewRouterEvent;
