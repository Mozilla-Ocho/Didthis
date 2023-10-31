/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dispatch } from "react";
import { Action, State } from "./state";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Payload } from "./messaging";
import { ApiUser } from "../types";
import * as SiteAPI from "../siteApi";
import Constants from "expo-constants";
import { AppRequestMethods } from "./types";

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
    this.registerDefaultMethods();
  }

  navigateToPath(path: string) {
    const webview = this.messaging.webview;
    if (!webview) return;
    webview.injectJavaScript(`window.location = "${siteBaseUrl}${path}"`);
  }

  get messaging() {
    return this.state?.messaging;
  }

  registerDefaultMethods() {
    if (!this.messaging) return;

    // TODO: declare these in a type shared with the server side
    // FIXME: this type isn't quite right, but it at least checks the keys
    const methods: Record<keyof AppRequestMethods, Function> = {
      ping: this.handlePing,
      useScreen: this.handleUseScreen,
      updateAppConfig: this.handleUpdateAppConfig,
      signin: this.handleSignin,
      updateTopNav: this.handleUpdateTopNav,
      pickImage: this.handlePickImage,
    };

    for (const [name, method] of Object.entries(methods)) {
      this.messaging.registerMethod(name, method.bind(this));
    }
  }

  async handlePing(payload: Payload) {
    this.dispatch({
      type: "update",
      key: "webContentReady",
      value: true,
    });
    return { message: "pong" };
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

  async handleSignin(payload: Payload, id: string) {
    await SiteAPI.resetSignin();
    this.navigation.navigate("Signin");
  }

  async handleUpdateTopNav(
    payload: AppRequestMethods["updateTopNav"]["request"],
    id: string
  ): Promise<AppRequestMethods["updateTopNav"]["response"]> {
    const { show, title, leftIsBack, leftLabel, rightLabel } = payload;
    this.dispatch({
      type: "update",
      key: "topNav",
      value: { show, title, leftIsBack, leftLabel, rightLabel }
    });
    return { success: true };
  }

  async handlePickImage(payload: Payload, id: string) {}
}
