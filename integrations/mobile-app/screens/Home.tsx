import * as React from "react";
import { useState, useRef } from "react";
import Constants from "expo-constants";
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";
import type { RootStackParamList } from "../App";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import WebView, { WebViewNavigation } from "react-native-webview";

import WebViewNavToolbar from "../components/WebViewNavToolbar";

export type HomeScreenRouteParams = {
  foo?: string;
};

export type HomeScreenProps = {
  foo: string;
} & NativeStackScreenProps<RootStackParamList, "Home">;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

const { siteBaseUrl, originWhitelist } = Constants.expoConfig.extra;

export default function HomeScreen(props: HomeScreenProps) {
  const { navigation } = props;

  const webviewRef = useRef<WebView>(null);
  const [webviewNavigation, setWebviewNavigation] = useState<
    WebViewNavigation | undefined
  >();

  const handleWebViewNavigationStateChange = (navState: WebViewNavigation) =>
    setWebviewNavigation(navState);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <WebView
        source={{ uri: siteBaseUrl }}
        originWhitelist={originWhitelist}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            color="black"
            size="large"
            style={styles.flexContainer}
          />
        )}
        ref={webviewRef}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
      <WebViewNavToolbar
        webview={webviewRef.current}
        webviewNavigation={webviewNavigation}
      />
    </SafeAreaView>
  );
}
