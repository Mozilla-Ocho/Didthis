import useAppShellHost from "../lib/appShellHost";
import { useEffect, useRef } from "react";
import WebView from "react-native-webview";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import Config from "../lib/config";
import Loader, { WebviewRouteChangeLoader } from "../components/Loader";
import * as AppleAuthentication from "expo-apple-authentication";
import { ConditionalTopNav } from "../components/TopNav";
import { ConditionalBottomNav } from "../components/BottomNav";
import { webviewRouterEvent } from "../lib/appShellHost/requestMethods/webviewRouterEvent";

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
        onNavigationStateChange={(navState) => {
          const { url: fullUrl, navigationType } = navState;
          // TODO: trigger webviewRouterEvent() from here?
          console.debug("NAV STATE CHANGE", navState);
          // HACK: simulate a webview router event on navigation
          if (fullUrl.indexOf(siteBaseUrl) === 0) {
            webviewRouterEvent(
              appShellHost,
              {
                event: "routeChangeComplete",
                url: fullUrl.substring(siteBaseUrl.length),
              },
              ""
            );
          }
        }}
        ref={webviewRef}
        onMessage={appShellHost.onMessage}
      />
      <ConditionalBottomNav />
      <WebviewRouteChangeLoader />
    </SafeAreaView>
  );
}
