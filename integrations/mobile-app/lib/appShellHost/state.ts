import { useReducer, Dispatch } from "react";
import { ApiUser } from "../types";

export type State = {
  webContentReady: boolean;
  user?: ApiUser;
  links: Record<string, string>;
  topNav?: {
    show?: boolean;
    title?: string;
    leftIsBack?: boolean;
    leftIsDisabled?: boolean;
    leftLabel?: string;
    rightIsDisabled?: boolean;
    rightLabel?: string;
  };
};

export function createInitialState(): State {
  return {
    webContentReady: false,
    links: {},
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
