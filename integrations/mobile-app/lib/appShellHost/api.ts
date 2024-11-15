/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dispatch } from "react";
import { Action, State, statePropertyUpdateAction, resetStateAction } from "./state";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import Config from "../../lib/config";
import MessageHandler from "./messaging";
import { WebViewMessageEvent, WebViewNavigation } from "react-native-webview";
import { webviewNavigationStateChange } from "./routes";

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
    this.postMessage("navigateToPath", { path });
  }

  set(...args: Parameters<typeof statePropertyUpdateAction>) {
    return this.dispatch(statePropertyUpdateAction(...args));
  }

  reset() {
    return this.dispatch(resetStateAction());
  }

  get onMessage() {
    return (event: WebViewMessageEvent) =>
      this.messaging.handleMessage(this, event);
  }

  get onNavigationStateChange() {
    return (event: WebViewNavigation) =>
      webviewNavigationStateChange(this, event)
  }

  setWebView(...args: Parameters<MessageHandler["setWebView"]>) {
    return this.messaging.setWebView(...args);
  }

  postMessage(...args: Parameters<MessageHandler["postMessage"]>) {
    return this.messaging.postMessage(...args);
  }
}
