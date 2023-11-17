import useAppShellHost from "../lib/appShellHost";
import { useCallback, useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import Config from "../lib/config";
import Loader from "../components/Loader";
import * as AppleAuthentication from "expo-apple-authentication";
import { ConditionalTopNav } from "../components/TopNav";
import { ConditionalBottomNav } from "../components/BottomNav";
import AppShellHostAPI from "../lib/appShellHost/api";

const { siteBaseUrl, originWhitelist } = Config;

export type WebAppScreenRouteParams = {
  credential?: AppleAuthentication.AppleAuthenticationCredential;
  resetWebViewAfter?: number;
};

export type WebAppScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "WebApp"
>;

export default function WebAppScreen({ route }: WebAppScreenProps) {
  const { credential, resetWebViewAfter = 0 } = route.params || {};

  const appShellHost = useAppShellHost();

  const webviewRef = useRef<WebView>(null);
  useEffect(
    () => appShellHost.setWebView(webviewRef.current),
    [appShellHost, webviewRef.current]
  );

  useSendAppleCredentialToWebContent(credential, appShellHost);
  const webviewKey = useResettableWebviewKey(resetWebViewAfter);

  return (
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>
      <StatusBar barStyle="dark-content" />
      <ConditionalTopNav />
      <WebView
        key={webviewKey}
        source={{ uri: siteBaseUrl }}
        originWhitelist={originWhitelist}
        startInLoadingState={true}
        renderLoading={() => <Loader />}
        ref={webviewRef}
        onMessage={appShellHost.onMessage}
      />
      <ConditionalBottomNav />
    </SafeAreaView>
  );
}

/**
 * Send the given Apple ID credential to web content when it's ready
 *
 * @param credential
 * @param appShellHost
 */
function useSendAppleCredentialToWebContent(
  credential: AppleAuthentication.AppleAuthenticationCredential,
  appShellHost: AppShellHostAPI
) {
  const webContentReady = appShellHost.state?.webContentReady;
  useEffect(() => {
    if (webContentReady && credential) {
      appShellHost.postMessage("appleCredential", { credential });
    }
  }, [webContentReady, appShellHost, credential]);
}

/**
 * Produce a key which changes when the webview should be re-rendered & reset
 * on focus of the current screen.
 *
 * @param resetWebViewAfter value of Date.now() after which to reset the webview
 * @param appShellHost app shell host API used for reset
 * @returns string current react component key for webview
 */
function useResettableWebviewKey(resetWebViewAfter: number): string {
  // Resetting the webview is kind of a hack: We maintain a "generation"
  // counter which, when incremented, forces a re-render of the component.
  //
  // This, in turn, discards state and forces a reset. Need to do this
  // in cases like signin where a fresh session is expected after signout.
  const [webviewGeneration, setWebviewGeneration] = useState(0);
  const [lastResetWebView, setLastResetWebView] = useState(Date.now());

  useFocusEffect(
    useCallback(() => {
      if (resetWebViewAfter !== 0 && resetWebViewAfter > lastResetWebView) {
        setLastResetWebView(Date.now());
        setWebviewGeneration((gen) => gen + 1);
      }
    }, [resetWebViewAfter])
  );

  return `webapp-webview-${webviewGeneration}`;
}
