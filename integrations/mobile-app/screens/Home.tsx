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
    return result.assets[0]
  }
};

export default function HomeScreen(props: HomeScreenProps) {
  const { navigation } = props;

  const webviewRef = useRef<WebView>(null);
  const [webviewNavigation, setWebviewNavigation] = useState<
    WebViewNavigation | undefined
  >();

  function postMessage(message: any) {
    // HACK: there's no postMessage on WebView, so we inject a script to dispatch event
    const data = JSON.stringify(message);
    // Escaping is hard business
    const toInject = `
      (function() {
        document.dispatchEvent(new MessageEvent('message', {
          data: \`${data.replace(/`/g, "\\`")}\`
        }));
      })();
    `;
    webviewRef.current?.injectJavaScript(toInject);
  }

  const [lastMessage, setLastMessage] = useState("");

  const handleNavigationStateChange = (navState: WebViewNavigation) =>
    setWebviewNavigation(navState);

  const handleMessage = (event: WebViewMessageEvent) => {
    const {
      nativeEvent: { data },
    } = event;

    setLastMessage(`${Date.now()}: ${data}`);

    try {
      const { type, payload } = JSON.parse(data);
      switch (type) {
        case "ping": {
          postMessage({ type: "pong" });
          break;
        }
        case "pickImage": {
          pickImage().then(result => {
            postMessage({
              type: "pickImage",
              payload: result
            });
          })
        }
      }
    } catch (e) {
      // failed to parse data
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
