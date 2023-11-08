/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dispatch } from "react";
import { Action, State, statePropertyUpdateAction } from "./state";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import Config from "../../lib/config";
import MessageHandler from "./messaging";
import { WebViewMessageEvent } from "react-native-webview";

const { siteBaseUrl, originWhitelist } = Config;

export default class AppShellHostAPI {
  messaging: MessageHandler;
  state: State;
  dispatch: Dispatch<Action> | undefined;
  navigation: NavigationProp<RootStackParamList>;

  constructor(context?: {
    messaging: MessageHandler;
    state: State;
    dispatch: Dispatch<Action> | undefined;
    navigation: NavigationProp<RootStackParamList>;
  }) {
    Object.assign(this, context);
  }

  navigateToPath(path: string) {
    // TODO: need to change this to use the next.js router so all the events work as expected?

    const webview = this.messaging.webview;
    if (!webview) return;
    this.set("webContentRouteChanging", true);
    webview.injectJavaScript(`window.location = "${siteBaseUrl}${path}"`);
  }

  set(...args: Parameters<typeof statePropertyUpdateAction>) {
    return this.dispatch(statePropertyUpdateAction(...args));
  }

  get onMessage() {
    return (event: WebViewMessageEvent) =>
      this.messaging.handleMessage(this, event);
  }

  setWebView(...args: Parameters<MessageHandler["setWebView"]>) {
    return this.messaging.setWebView(...args)
  }

  postMessage(...args: Parameters<MessageHandler["postMessage"]>) {
    return this.messaging.postMessage(...args)
  }
}
