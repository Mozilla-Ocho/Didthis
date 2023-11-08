import type { Methods } from "./index";

export const webviewRouterEvent: Methods["webviewRouterEvent"] = async (
  api,
  payload
) => {
  const { event, url } = payload;
  const { state } = api;

  const route = matchRoute(url);
  if (!route) {
    console.debug("WEBVIEW ROUTER EVENT UNMATCHED", event, url);
    return { success: true };
  }

  if (event === "routeChangeStart") {
    api.set("webContentRouteChanging", true);
  } else if (event === "routeChangeComplete") {
    const showBottomNav = !hideBottomNavRoutes.includes(route?.name);
    api.set("bottomNav", { show: showBottomNav });
    api.set("topNav", { show: false });
    api.set("webContentRouteChanging", false);
  }

  return { success: true };
};

const hideBottomNavRoutes: RoutePatternName[] = [
  "postNew",
  "postEdit",
  "projectEdit",
  "projectNew",
];

function matchRoute(url: string): MatchRouteResult | undefined {
  for (const [name, pattern] of routePatterns) {
    const match = pattern.exec(url);
    if (!match) continue;
    return { name, params: match.groups || {} };
  }
}

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
