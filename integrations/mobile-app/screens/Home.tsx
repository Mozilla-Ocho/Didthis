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
import WebView, {
  WebViewNavigation,
  WebViewMessageEvent,
} from "react-native-webview";
import { btoa } from 'react-native-quick-base64';

import * as ImagePicker from "expo-image-picker";

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

const pickImage = async () => {
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
};

export default function HomeScreen(props: HomeScreenProps) {
  const { navigation } = props;

  const webviewRef = useRef<WebView>(null);
  const [webviewNavigation, setWebviewNavigation] = useState<
    WebViewNavigation | undefined
  >();

  function postMessage(message: any) {
    // HACK: no postMessage on WebView, so here's a hack to simulate
    // using base64 here because character escaping is a rough business
    webviewRef.current?.injectJavaScript(`
      (function() {
        document.dispatchEvent(
          new MessageEvent('message', {
            data: window.atob("${btoa(JSON.stringify(message))}")
          }
        ));
      })();
    `);
  }

  const [lastMessage, setLastMessage] = useState("");

  const handleNavigationStateChange = (navState: WebViewNavigation) =>
    setWebviewNavigation(navState);

  const handleMessage = (event: WebViewMessageEvent) => {
    const {
      nativeEvent: { data },
    } = event;

    setLastMessage(`${Date.now()}: ${data}`);

    const { type, payload } = JSON.parse(data);
    setLastMessage(`${Date.now()}: ${type}`);
    switch (type) {
      case "ping": {
        postMessage({ type: "pong" });
        break;
      }
      case "pickImage": {
        pickImage().then((result) => {
          postMessage({
            type: "pickImage",
            payload: result,
          });
        });
      }
    }
  };

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
