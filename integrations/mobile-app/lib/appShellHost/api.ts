/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dispatch } from "react";
import { Action, State } from "./state";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Payload } from "./messaging";

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

    if (this.messaging) {
      this.messaging.registerMethod(
        "useScreen",
        this.handleUseScreen.bind(this)
      );
    }
  }

  get messaging() {
    return this.state?.messaging;
  }

  async handleUseScreen(payload: Payload, id: string) {
    const response = this.messaging.deferResponse(id);
    // @ts-ignore throw a runtime error if web content asks for an unknown route
    this.navigation.navigate(payload.screen, { requestId: id, payload });
    return response;
  }
}
