/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dispatch } from "react";
import { Action, State, statePropertyUpdateAction } from "./state";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Payload } from "./messaging";
import { ApiUser } from "../types";
import * as SiteAPI from "../siteApi";
import Constants from "expo-constants";
import { AppRequestMethods } from "./types";
import * as ImagePicker from "expo-image-picker";

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
    Object.assign(this, { state, dispatch, navigation });
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

  set(...args: Parameters<typeof statePropertyUpdateAction>) {
    return this.dispatch(statePropertyUpdateAction(...args));
  }

  async handlePing(payload: Payload) {
    this.set("webContentReady", true);
    return { message: "pong" };
  }

  async handleUpdateAppConfig(
    payload: AppRequestMethods["updateAppConfig"]["request"]
  ): Promise<AppRequestMethods["updateAppConfig"]["response"]> {
    const { user, links } = payload;
    this.set("user", user);
    this.set("links", { ...this.state.links, ...links });
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
    payload: AppRequestMethods["updateTopNav"]["request"]
  ): Promise<AppRequestMethods["updateTopNav"]["response"]> {
    this.set("topNav", payload);
    return { success: true };
  }

  async handlePickImage(payload: Payload, id: string) {
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
  }
}
