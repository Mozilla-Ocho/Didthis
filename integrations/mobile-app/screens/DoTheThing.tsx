import * as React from "react";
import { Platform, Button, View, Text } from "react-native";
import type { RootStackParamList } from "../App";
import { StackScreenProps } from "@react-navigation/stack";
import useAppShellHost from "../lib/appShellHost";
import { Payload } from "../lib/appShellHost/messaging";

export type DoTheThingScreenRouteParams = {
  requestId: string;
  payload: Payload;
};

export type DoTheThingScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "DoTheThing"
>;

export default function DoTheThingScreen(props: DoTheThingScreenProps) {
  const appShellHost = useAppShellHost();
  const { navigation, route } = props;
  const { requestId, payload } = route.params;

  const onResponsePress = () => {
    const response = appShellHost.messaging.getDeferredResponse(requestId);
    response.resolve({
      message: `IT WORKED ${Date.now()}`,
      platform: {
        ...JSON.parse(JSON.stringify(Platform))
      }
    });
    navigation.goBack();
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Payload from web content: {JSON.stringify(payload)}</Text>
      {requestId && (
        <Button
          title={`RESPOND TO ${requestId}`}
          onPress={onResponsePress}
        />
      )}
    </View>
  );
}
