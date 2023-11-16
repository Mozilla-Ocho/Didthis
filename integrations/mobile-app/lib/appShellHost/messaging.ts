import WebView, { WebViewMessageEvent } from "react-native-webview";
import AppShellHostAPI from "./api";
import { handleRequest } from "./requestMethods";
import {
  AppMessages,
  MessageRequests,
  MessageResponses,
  AppRequestMethodNames,
  AppRequestMethods,
} from "./types";

export default class MessageHandler {
  api: AppShellHostAPI;
  webview: WebView | undefined;
  deferredResponses: Record<MessageResponses["id"], DeferredResponse>;

  constructor() {
    this.webview = undefined;
    this.deferredResponses = {};
  }

  setWebView(webview: WebView) {
    this.webview = webview;
  }

  async deferResponse<K extends AppRequestMethodNames>(
    id: MessageResponses["id"]
  ) {
    type Response = AppRequestMethods[K]["response"];
    return new Promise<Response>((resolve, reject) => {
      this.deferredResponses[id] = {
        resolve: this.withDeferredResponseCleanup(id, resolve),
        reject: this.withDeferredResponseCleanup(id, reject),
      };
    });
  }

  withDeferredResponseCleanup<U extends (...args: any[]) => any>(
    id: MessageResponses["id"],
    func: U
  ) {
    return (...args: Parameters<U>): ReturnType<U> => {
      delete this.deferredResponses[id];
      return func(...args);
    };
  }

  getDeferredResponse<K extends AppRequestMethodNames>(
    id: MessageResponses["id"]
  ) {
    return this.deferredResponses[id] as DeferredResponses[K];
  }

  postMessage<T extends keyof AppMessages>(
    type: T,
    payload: AppMessages[T],
    id?: string
  ) {
    const message = { type, payload, id };
    this.webview?.postMessage(JSON.stringify(message));
  }

  async handleMessage(api: AppShellHostAPI, event: WebViewMessageEvent) {
    try {
      const {
        nativeEvent: { data },
      } = event;
      const message = JSON.parse(data);
      if (!message || !message.type || !message.id) return;
      if (message.type === "request") {
        await handleRequest(api, message as MessageRequests);
      }
    } catch (err) {
      // TODO: handle exceptions more usefully here?
      console.error(err);
    }
  }
}

export type DeferredResponses = {
  [K in AppRequestMethodNames]: {
    resolve: (payload: AppRequestMethods[K]["response"]) => void;
    reject: (error: Error) => void;
  };
};

export type DeferredResponse = DeferredResponses[AppRequestMethodNames];
