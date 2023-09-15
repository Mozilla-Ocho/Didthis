import { Dispatch } from "react";
import { Action, State, createInitialState } from "./state";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { NavigationProp, useNavigation, useNavigationState } from "@react-navigation/native";

export default class AppShellHostAPI {
  state?: State;
  dispatch?: Dispatch<Action> | undefined;
  navigation?: ReturnType<typeof useNavigation>;

  constructor(
    state?: State,
    dispatch?: Dispatch<Action>,
    navigation?: ReturnType<typeof useNavigation>,
  ) {
    Object.assign(this, {
      state, dispatch, navigation
    })
  }

  get messaging() {
    return this.state.messaging;
  }

  /*
  showAppFeatureOverlay() {
    this.dispatch({
      type: "update",
      key: "appFeatureOverlayIsVisible",
      value: true,
    });
  }

  hideAppFeatureOverlay() {
    this.dispatch({
      type: "update",
      key: "appFeatureOverlayIsVisible",
      value: false,
    });
  }
  */
}
