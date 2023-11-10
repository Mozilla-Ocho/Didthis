import { ApiUser } from "../types";
import { AppleAuthenticationCredential } from "expo-apple-authentication";

// TODO: share this with react native project to define expected app message payloads

export type AppMessages = {
  response: AppRequestMethods[AppRequestMethodNames]["response"];
  request: AppRequestMethods[AppRequestMethodNames]["request"];
  navigateToPath: { path: string };
  appleCredential: { credential: AppleAuthenticationCredential };
  topNavLeftPress: { label: string };
  topNavRightPress: { label: string };
  topNavSharePress: { label: string };
  topNavEditPress: { label: string };
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
  webviewRouterEvent: {
    request: {
      event: "routeChangeStart" | "routeChangeComplete";
      url: string;
    };
    response: Success;
  };
  pickDateTime: {
    request: {
      title?: string;
      initialDateTime?: number;
    };
    response: {
      dateTime: number;
      changed: boolean;
    };
  };
  pickImage: {
    request: {
      intent: CldImageIntent;
    };
    response:
      | { cancelled: true }
      | {
          asset_id: string;
          created_at: string;
          format: string;
          image_metadata: JSONObject;
          resource_type: string;
          secure_url: string;
          url: string;
          width: number;
          height: number;
        };
  };
  shareProjectUrl: {
    request: {
      title: string;
      url: string;
    };
    response: Success;
  };
  updateAppConfig: {
    request: {
      user: ApiUser;
      links: {
        user: string;
        userEdit: string;
        newPost: string;
      };
    };
    response: JSONObject;
  };
  updateTopNav: {
    request: {
      show?: boolean;
      title?: string;
      leftIsBack?: boolean;
      leftLabel?: string;
      leftIsDisabled?: boolean;
      rightLabel?: string;
      rightIsDisabled?: boolean;
      showShare?: boolean;
      shareIsDisabled?: boolean;
      showEdit?: boolean;
      editIsDisabled?: boolean;
    };
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

export type DeferredResponses = {
  [K in AppRequestMethodNames]: {
    resolve: (payload: AppRequestMethods[K]["response"]) => void;
    reject: (error: any) => void;
  };
};

export type DeferredResponse = DeferredResponses[AppRequestMethodNames];

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

export type CldImageIntent = 'avatar' | 'post' | 'project';