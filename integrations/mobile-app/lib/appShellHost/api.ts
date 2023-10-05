/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dispatch } from "react";
import { Action, State } from "./state";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Payload } from "./messaging";
import { ApiUser } from "../types";
import Constants from "expo-constants";

const { siteBaseUrl } = Constants.expoConfig.extra;

export default class AppShellHostAPI {
  state?: State;
  dispatch?: Dispatch<Action> | undefined;
  navigation?: NavigationProp<RootStackParamList>;

  constructor(
    state?: AppShellHostAPI["state"],
    dispatch?: AppShellHostAPI["dispatch"],
    navigation?: AppShellHostAPI["navigation"]
  ) {
    Object.assign(this, {
      state,
      dispatch,
      navigation,
    });

    if (!this.messaging) return;

    this.messaging.registerMethod("useScreen", this.handleUseScreen.bind(this));
    this.messaging.registerMethod(
      "updateAppConfig",
      this.handleUpdateAppConfig.bind(this)
    );
  }

  navigateToPath(path: string) {
    const webview = this.messaging.webview;
    if (!webview) return;
    webview.injectJavaScript(`window.location = "${siteBaseUrl}${path}"`);
  }

  get messaging() {
    return this.state?.messaging;
  }

  async handleUpdateAppConfig(payload: Payload) {
    // HACK: should probably do some validation here?
    const { user, links } = payload;

    this.dispatch({
      type: "update",
      key: "user",
      value: user as unknown as ApiUser,
    });

    this.dispatch({
      type: "update",
      key: "links",
      value: {
        ...this.state.links,
        ...(links as State["links"]),
      },
    });

    return { success: true };
  }

  async handleUseScreen(payload: Payload, id: string) {
    const response = this.messaging.deferResponse(id);
    // @ts-ignore throw a runtime error if web content asks for an unknown route
    this.navigation.navigate(payload.screen, { requestId: id, payload });
    return response;
  }
}
