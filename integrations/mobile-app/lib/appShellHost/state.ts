import { useReducer, Dispatch } from "react";
import { ApiUser } from "../types";
import { AppRequestMethods, VersionInfo } from "./types";
import { WebViewNavigation } from "react-native-webview";

export type State = {
  loading: boolean;
  webContentReady: boolean;
  webContentRouteChanging: boolean;
  webContentNavigation?: WebViewNavigation;
  user?: ApiUser;
  links: Record<string, string>;
  topNav?: AppRequestMethods["updateTopNav"]["request"];
  bottomNav?: {
    show?: boolean;
  };
  contentVersionInfo?: VersionInfo;
  viewingProjectId: string; // empty string when not viewing a project
};

export function createInitialState(): State {
  return {
    loading: false,
    webContentReady: false,
    webContentRouteChanging: false,
    links: {},
    bottomNav: { show: true },
    viewingProjectId: '',
  };
}

export function resetStateAction() {
  return { type: "reset" } as const;
}

export type ResetStateAction = ReturnType<typeof resetStateAction>;

export type ObjectUpdateAction<T extends string, C extends object> = {
  [K in keyof C]: {
    type: T;
    key: K;
    value: C[K];
  };
}[keyof C];

export type StatePropertyUpdate = ObjectUpdateAction<"update", State>;

export function statePropertyUpdateAction<
  S extends State,
  K extends keyof S,
  V extends S[K]
>(key: K, value: V) {
  return {
    type: "update",
    key,
    value,
  } as StatePropertyUpdate;
}

export type Action = ResetStateAction | StatePropertyUpdate;

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case "reset":
      return createInitialState();
    case "update":
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
}

export function useAppShellHostState(): [State, Dispatch<Action>] {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  return [state, dispatch];
}
