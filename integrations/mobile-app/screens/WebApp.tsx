import useAppShellHost from "../lib/appShellHost";
import { useEffect, useRef, useState } from "react";
import WebView, { WebViewNavigation } from "react-native-webview";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import WebViewNavToolbar from "../components/WebViewNavToolbar";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import Config from "../lib/config";
import Loader from "../components/Loader";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRoute } from "@react-navigation/native";
import { Payload } from "../lib/appShellHost/messaging";

const { siteBaseUrl, originWhitelist } = Config;

export type WebAppScreenRouteParams = {
  credential?: AppleAuthentication.AppleAuthenticationCredential;
};

export type WebAppScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "WebApp"
>;

export default function WebAppScreen({ route }: WebAppScreenProps) {
  const { credential } = route.params;
  const appShellHost = useAppShellHost();
  const { messaging } = appShellHost;
  const { webContentReady } = appShellHost.state;

  const webviewRef = useRef<WebView>(null);

  const [webviewNavigation, setWebviewNavigation] = useState<
    WebViewNavigation | undefined
  >();

  useEffect(
    () => messaging?.setWebView(webviewRef.current),
    [messaging, webviewRef.current]
  );

  useEffect(() => {
    if (messaging && credential && webContentReady) {
      messaging.postMessage("appleCredential", {
        // HACK: credential is compatible with Payload, might be a better way to handle this.
        timeSent: Date.now(),
        credential: credential as unknown as Payload,
      });
      console.log("SENT CREDENTIAL", Date.now());
    }
  }, [webContentReady, messaging, credential]);

  const handleNavigationStateChange = (navState: WebViewNavigation) =>
    setWebviewNavigation(navState);

  return (
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>
      <StatusBar barStyle="dark-content" />
      <WebView
        source={{ uri: siteBaseUrl }}
        originWhitelist={originWhitelist}
        startInLoadingState={true}
        renderLoading={() => <Loader />}
        ref={webviewRef}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={messaging.onMessage}
      />
      <WebViewNavToolbar
        webview={webviewRef.current}
        webviewNavigation={webviewNavigation}
      />
    </SafeAreaView>
  );
}
