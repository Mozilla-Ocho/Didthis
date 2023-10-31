import useAppShellHost from "../lib/appShellHost";
import { useEffect, useRef, useState } from "react";
import WebView, { WebViewNavigation } from "react-native-webview";
import { Text, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import WebViewNavToolbar from "../components/WebViewNavToolbar";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import Config from "../lib/config";
import Loader from "../components/Loader";
import * as AppleAuthentication from "expo-apple-authentication";
import { Payload } from "../lib/appShellHost/messaging";
import TopNav from "../components/TopNav";

const { siteBaseUrl, originWhitelist } = Config;

export type WebAppScreenRouteParams = {
  credential?: AppleAuthentication.AppleAuthenticationCredential;
};

export type WebAppScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "WebApp"
>;

export default function WebAppScreen({ route }: WebAppScreenProps) {
  const { credential } = route.params || {};
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
      messaging.postMessage("appleCredential", { credential });
    }
  }, [webContentReady, messaging, credential]);

  const handleNavigationStateChange = (navState: WebViewNavigation) =>
    setWebviewNavigation(navState);

  return (
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>
      <StatusBar barStyle="dark-content" />
      <ConditionalTopNav />
      <WebView
        source={{ uri: siteBaseUrl }}
        originWhitelist={originWhitelist}
        startInLoadingState={true}
        renderLoading={() => <Loader />}
        ref={webviewRef}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={messaging.onMessage}
      />
    </SafeAreaView>
  );
}

function ConditionalTopNav() {
  const appShellHost = useAppShellHost();
  const { messaging } = appShellHost;

  const { topNav } = appShellHost.state;
  if (!topNav?.show) return;

  const { title, leftLabel, rightLabel, leftIsBack } = topNav;

  let onLeftPress = undefined;
  if (leftLabel) {
    onLeftPress = () =>
      messaging.postMessage("topNavLeftPress", { label: leftLabel });
  }

  let onRightPress = undefined;
  if (rightLabel) {
    onRightPress = () =>
      messaging.postMessage("topNavRightPress", { label: rightLabel });
  }

  return (
    <TopNav
      {...{
        title,
        leftLabel,
        leftIsBack,
        onLeftPress,
        rightLabel,
        onRightPress,
      }}
    />
  );
}
