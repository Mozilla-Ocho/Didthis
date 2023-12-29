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
  trackNativeEvent: { event: NativeEventNames };
};

// DRY_76795 native event types handling
export type NativeEventNames =
  'bcNtvDrawerOpen' |
  'bcNtvDrawerCreateProject' |
  'bcNtvDrawerProject';

export type AppRequestMethods = {
  ping: {
    request: VersionInfo;
    response: VersionInfo;
  };
  signin: {
    request: undefined;
    response: JSONObject;
  };
  showAppInfo: {
    request: undefined;
    response: Success;
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
          public_id: string;
          created_at: string;
          format: string;
          image_metadata: JSONObject;
          exif: JSONObject;
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

export type VersionInfo = {
  version?: string;
  build?: string;
  tag?: string;
  update?: string;
  channel?: string;
};

export type CldImageIntent = "avatar" | "post" | "project";

export type AppRequestMethodNames = keyof AppRequestMethods;

export type MessageRequest<K extends keyof AppRequestMethods> = {
  type: "request";
  id: string;
  method: K;
  payload: AppRequestMethods[K]["request"];
};

export type MessageRequests = {
  [K in AppRequestMethodNames]: MessageRequest<K>;
}[AppRequestMethodNames];

export type MessageResponse<K extends keyof AppRequestMethods> = {
  type: "response";
  id: string;
  method: K;
  payload: AppRequestMethods[K]["response"] | Failure;
};

export type MessageResponses = {
  [K in AppRequestMethodNames]: MessageResponse<K>;
}[AppRequestMethodNames];

export type Success = { success: true };

export type Failure = {
  failure: true;
  message: string;
  // 🤷‍♂️ optional additional properties
  [K: string]: JSONValue;
};

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
