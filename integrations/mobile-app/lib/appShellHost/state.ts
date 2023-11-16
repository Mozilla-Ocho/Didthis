import { useReducer, Dispatch } from "react";
import { ApiUser } from "../types";
import { AppRequestMethods } from "./types";

export type State = {
  loading: boolean;
  webContentReady: boolean;
  webContentRouteChanging: boolean;
  user?: ApiUser;
  links: Record<string, string>;
  topNav?: AppRequestMethods["updateTopNav"]["request"];
  bottomNav?: {
    show?: boolean;
  };
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

export type ObjectUpdateAction<T extends string, C extends object> = {
  [K in keyof C]: {
    type: T;
    key: K;
    value: C[K];
  };
}[keyof C];

export type StatePropertyUpdate = ObjectUpdateAction<"update", State>;

export type Action = StatePropertyUpdate;

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

export function reducer(state: State, action: Action) {
  switch (action.type) {
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
