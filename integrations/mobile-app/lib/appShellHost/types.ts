import { ApiUser } from "../types";
import { AppleAuthenticationCredential } from "expo-apple-authentication";

// TODO: share this with react native project to define expected app message payloads

export type AppMessages = {
  response: AppRequestMethods[AppRequestMethodNames]["response"];
  request: AppRequestMethods[AppRequestMethodNames]["request"];
  appleCredential: { credential: AppleAuthenticationCredential };
  topNavLeftPress: { label: string };
  topNavRightPress: { label: string };
};

export type AppRequestMethods = {
  ping: {
    request: undefined;
    response: JSONObject;
  };
  signin: {
    request: undefined;
    response: JSONObject;
  };
  useScreen: {
    request: JSONObject;
    response: JSONObject;
  };
  updateAppConfig: {
    request: {
      user: ApiUser;
      links: Record<string, string>;
    };
    response: JSONObject;
  };
  updateTopNav: {
    request: {
      show: boolean;
      title?: string;
      leftIsBack?: boolean;
      leftLabel?: string;
      leftIsDisabled?: boolean;
      rightLabel?: string;
      rightIsDisabled?: boolean;
    };
    response: JSONObject;
  };
  pickImage: {
    request: JSONObject;
    response: JSONObject;
  };
};

export type AppRequestMethodNames = keyof AppRequestMethods;

export type MessageRequest = {
  [K in AppRequestMethodNames]: {
    type: "request";
    id: string;
    method: K;
    payload: AppRequestMethods[K]["request"];
  };
}[AppRequestMethodNames];

export type MessageResponse = {
  [K in AppRequestMethodNames]: {
    type: "response";
    id: string;
    method: K;
    payload: AppRequestMethods[K]["response"];
  };
}[AppRequestMethodNames];

export type DeferredResponse = {
  [K in AppRequestMethodNames]: {
    resolve: (payload: AppRequestMethods[K]["response"]) => void;
    reject: (error: any) => void;
  }
}[AppRequestMethodNames];

export type Success = { success: true };

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export interface JSONObject {
  [k: string]: JSONValue;
}
