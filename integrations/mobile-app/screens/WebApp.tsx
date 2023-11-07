import useAppShellHost from "../lib/appShellHost";
import { useEffect, useRef, useState } from "react";
import WebView, { WebViewNavigation } from "react-native-webview";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import Config from "../lib/config";
import Loader from "../components/Loader";
import * as AppleAuthentication from "expo-apple-authentication";
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

  const webviewRef = useRef<WebView>(null);
  useEffect(
    () => appShellHost.setWebView(webviewRef.current),
    [appShellHost, webviewRef.current]
  );

  const { webContentReady } = appShellHost.state || {};
  useEffect(() => {
    if (credential && webContentReady) {
      appShellHost.postMessage("appleCredential", { credential });
    }
  }, [webContentReady, appShellHost, credential]);

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
        onMessage={appShellHost.onMessage}
      />
    </SafeAreaView>
  );
}

function ConditionalTopNav() {
  const appShellHost = useAppShellHost();
  const { messaging } = appShellHost;

  const { topNav } = appShellHost.state;
  if (!topNav?.show) return;

  const onLeftPress = () =>
    messaging.postMessage("topNavLeftPress", { label: topNav.leftLabel });
  const onRightPress = () =>
    messaging.postMessage("topNavRightPress", { label: topNav.rightLabel });
  const onSharePress = () =>
    messaging.postMessage("topNavSharePress", { label: "Share" });
  const onEditPress = () =>
    messaging.postMessage("topNavEditPress", { label: "Edit" });

  return (
    <TopNav
      {...{
        ...topNav,
        onLeftPress,
        onRightPress,
        onSharePress,
        onEditPress,
      }}
    />
  );
}
