import WebView, { WebViewMessageEvent } from "react-native-webview";
import AppShellHostAPI from "./api";
import { handleRequest } from "./requestMethods";
import {
  AppMessages,
  MessageRequest,
  MessageResponse,
  DeferredResponse,
  AppRequestMethodNames,
  AppRequestMethods,
  DeferredResponses,
} from "./types";

export default class MessageHandler {
  api: AppShellHostAPI;
  webview: WebView | undefined;
  deferredResponses: Record<MessageResponse["id"], DeferredResponse>;

  constructor() {
    this.webview = undefined;
    this.deferredResponses = {};
  }

  setWebView(webview: WebView) {
    this.webview = webview;
  }

  async deferResponse<K extends AppRequestMethodNames>(id: MessageResponse["id"]) {
    return new Promise<AppRequestMethods[K]["response"]>((resolve, reject) => {
      this.deferredResponses[id] = { resolve, reject };
    }).then((result) => {
      delete this.deferredResponses[id];
      return result;
    });
    // TODO: catch?
  }

  getDeferredResponse<K extends AppRequestMethodNames>(id: MessageResponse["id"]) {
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
        await handleRequest(api, message as MessageRequest);
      }
    } catch (err) {
      // TODO: handle exceptions more usefully here?
      console.error(err);
    }
  }
}
