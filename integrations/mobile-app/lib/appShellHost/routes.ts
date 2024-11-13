import AppShellHostAPI from "./api";
import { WebViewNavigation } from "react-native-webview";
import Config from "../../lib/config";

/**
 * Handle a change in WebView navigation
 *
 * Occasionally called redundantly with webviewRouterEvent, but also called
 * for off-site URLs and hard refreshes on-site
 */
export async function webviewNavigationStateChange(
  api: AppShellHostAPI,
  event: WebViewNavigation
) {
  const { url } = event;
  api.set("webContentNavigation", event);

  const route: MatchRouteResult | undefined = url.startsWith(Config.siteBaseUrl)
    ? matchRoute(new URL(url).pathname)
    : { name: "offSite", params: {} };

  if (route) {
    routeChangeComplete(api, route, true);
  }
}

/**
 * Handle the start of a route change in the web content app
 *
 * This can inconsistently be called multiple times in a row - e.g. for
 * both a webview navigation change and a request method call from
 * client-side router. So, try to keep things idempotent.
 */
export function routeChangeStart(
  api: AppShellHostAPI,
  route: MatchRouteResult,
  fromWebView: boolean = false
) {
  api.set("loading", true);
  api.set("webContentRouteChanging", true);
}

/**
 * Handle the completion of a route change in the web content app
 *
 * This can inconsistently be called multiple times in a row - e.g. for
 * both a webview navigation change and a request method call from
 * client-side router. So, try to keep things idempotent.
 */
export function routeChangeComplete(
  api: AppShellHostAPI,
  route: MatchRouteResult,
  fromWebView: boolean = false
) {
  api.set("loading", false);
  api.set("webContentRouteChanging", false);

  const showBottomNav = !hideBottomNavRoutes.includes(route?.name);
  api.set("bottomNav", { show: showBottomNav });
  api.set("topNav", { show: false });

  // detect when the route is viewing a project id. this changes the behavior
  // of the bottom bar plus button to add to this project id instead of showing
  // the drawer to pick one.
  let projectId = "";
  if (route?.params.project) {
    projectId = route?.params.project;
  }
  api.set("viewingProjectId", projectId);
}

// List of routes for which the bottom nav bar will be hidden
const hideBottomNavRoutes: RoutePatternName[] = [
  "offSite",
  "userEdit",
  "postNew",
  "postEdit",
  "projectEdit",
  "projectNew",
];

/**
 * Utility to match route URL and extract parameters
 *
 * @param url string
 * @returns MatchRouteResult
 */
export function matchRoute(url: string): MatchRouteResult | undefined {
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

type RoutePatternName = "offSite" | (typeof routePatternsSource)[number][0];

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
