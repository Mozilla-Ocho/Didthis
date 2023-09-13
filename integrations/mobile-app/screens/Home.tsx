import * as React from "react";
import { useState, useRef } from "react";
import Constants from "expo-constants";
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Text,
} from "react-native";
import type { RootStackParamList } from "../App";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import WebView, { WebViewNavigation, WebViewMessageEvent } from "react-native-webview";

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

  // HACK: there's no postMessage on WebView, so we inject a script to dispatch event
  function postMessage(message: any) {
    webviewRef.current?.injectJavaScript(
      buildInjectableJSMessage(message)
    );
  }

  const [lastMessage, setLastMessage] = useState("");

  const handleNavigationStateChange = (navState: WebViewNavigation) =>
    setWebviewNavigation(navState);

  const handleMessage = (event: WebViewMessageEvent) => {
    const {
      nativeEvent: { data },
    } = event;

    setLastMessage(`${Date.now()}: ${JSON.stringify(data)}`);

    if (data === "ping") {
      postMessage("pong");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>In app last message: {lastMessage}</Text>
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
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={handleMessage}
      />
      <WebViewNavToolbar
        webview={webviewRef.current}
        webviewNavigation={webviewNavigation}
      />
    </SafeAreaView>
  );
}

// HACK: there's no postMessage to webview, so we inject a lil script
function buildInjectableJSMessage(message: any) {
  return `
    (function() {
      document.dispatchEvent(new MessageEvent('message', {
        data: ${JSON.stringify(message)}
      }));
    })();
  `;
}
