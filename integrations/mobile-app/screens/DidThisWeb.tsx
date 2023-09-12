import * as React from "react";
import { Button, View, Text, SafeAreaView } from "react-native";
import type { RootStackParamList } from "../App";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import WebView from "react-native-webview";

export type DidthisWebScreenRouteParams = {
  now: number;
  thingy: string;
};

export type DidthisWebScreenProps = {} & NativeStackScreenProps<
  RootStackParamList,
  "DidthisWeb"
>;

export default function DidthisWebScreen(props: DidthisWebScreenProps) {
  const { navigation, route } = props;
  const { now, thingy } = route.params;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: "https://didthis.app" }}
        originWhitelist={["https://didthis.app"]}
      />
    </SafeAreaView>
  );
}
