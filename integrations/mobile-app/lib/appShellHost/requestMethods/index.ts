import AppShellHostAPI from "../api";
import { AppRequestMethods, MessageRequest } from "../types";
import * as SiteAPI from "../../siteApi";
import * as ImagePicker from "expo-image-picker";

import webviewRouterEvent from "./webviewRouterEvent";
import pickDateTime from "./pickDateTime";
import shareProjectUrl from "./shareProjectUrl";

export async function handleRequest(
  api: AppShellHostAPI,
  request: MessageRequest
) {
  const { method, payload, id } = request;
  try {
    const responsePayload = await callRequestMethod(api, method, payload, id);
    api.messaging.postMessage("response", responsePayload, id);
  } catch (err) {
    // TODO: establish a "responseError" message type?
    console.error(err);
  }
}

export async function callRequestMethod<K extends keyof AppRequestMethods>(
  api: AppShellHostAPI,
  method: K,
  payload: AppRequestMethods[K]["request"],
  id: string
) {
  if (method in methods) {
    return methods[method](api, payload, id);
  }
  throw new RequestMethodError(`unknown request method: ${method}`);
}

export class RequestMethodError extends Error {}

export type Methods = {
  [K in keyof AppRequestMethods]: (
    api: AppShellHostAPI,
    payload: AppRequestMethods[K]["request"],
    id: string
  ) => Promise<AppRequestMethods[K]["response"]>;
};

export const methods: Methods = {
  webviewRouterEvent,
  pickDateTime,
  shareProjectUrl,

  ping: async (api, payload) => {
    api.set("webContentReady", true);
    return { message: "pong" };
  },

  updateAppConfig: async (api, payload) => {
    const { user, links } = payload;
    api.set("user", user);
    api.set("links", { ...api.state.links, ...links });
    return { success: true };
  },

  signin: async (api) => {
    await SiteAPI.resetSignin();
    api.navigation.navigate("Signin");
    return { success: true };
  },

  updateTopNav: async (api, payload) => {
    api.set("topNav", payload);
    return { success: true };
  },

  pickImage: async (api, payload, string) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      return result.assets[0];
    }
  },
};
