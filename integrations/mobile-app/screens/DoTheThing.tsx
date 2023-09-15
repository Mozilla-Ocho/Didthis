import * as React from "react";
import { Platform, Button, View, Text } from "react-native";
import type { RootStackParamList } from "../App";
import { StackScreenProps } from "@react-navigation/stack";
import useAppShellHost from "../lib/appShellHost";

export type DoTheThingScreenRouteParams = {
  requestId: string;
  payload: Record<string, string>;
};

export type DoTheThingScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "DoTheThing"
>;

export default function DoTheThingScreen(props: DoTheThingScreenProps) {
  const appShellHost = useAppShellHost();
  const { navigation, route } = props;

  const { requestId } = route.params;
  const response = appShellHost.messaging.getDeferredResponse(requestId);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Projects Screen: {JSON.stringify(props)}</Text>
      {requestId && (
        <Button
          title={`RESPOND TO ${requestId}`}
          onPress={() => {
            navigation.goBack();
            response.resolve({
              message: `IT WORKED ${Date.now()}`,
              platform: {
                ...JSON.parse(JSON.stringify(Platform))
              }
            });
          }}
        />
      )}
    </View>
  );
}
