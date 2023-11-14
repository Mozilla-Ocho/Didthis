import AppShellHostAPI from "../api";
import { AppRequestMethods, Failure, MessageRequests } from "../types";
import * as SiteAPI from "../../siteApi";

import webviewRouterEvent from "./webviewRouterEvent";
import pickDateTime from "./pickDateTime";
import shareProjectUrl from "./shareProjectUrl";
import pickImage from "./pickImage";

export async function handleRequest(
  api: AppShellHostAPI,
  request: MessageRequests
) {
  const { method, payload, id } = request;
  try {
    const responsePayload = await callRequestMethod(api, method, payload, id);
    api.messaging.postMessage("response", responsePayload, id);
  } catch (err) {
    console.error(err);
    const responseFailurePayload: Failure = {
      failure: true,
      message: "message" in err ? err.message : "" + err,
    };
    api.messaging.postMessage("response", responseFailurePayload, id);
  }
}

export async function callRequestMethod<K extends keyof AppRequestMethods>(
  api: AppShellHostAPI,
  method: K,
  payload: AppRequestMethods[K]["request"],
  id: string
): Promise<AppRequestMethods[K]["response"] | Failure> {
  try {
    if (method in methods) {
      return methods[method](api, payload, id);
    }
    throw new RequestMethodError(`unknown request method: ${method}`);
  } catch (err) {
    const message = "message" in err ? err.message : "" + err;
    return { failure: true, message, ...err };
  }
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
  pickImage,

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
};
