import useAppShellHost from "../lib/appShellHost";
import { useCallback, useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import Config from "../lib/config";
import Loader from "../components/Loader";
import * as AppleAuthentication from "expo-apple-authentication";
import TopNav, { ConditionalTopNav } from "../components/TopNav";
import { ConditionalBottomNav } from "../components/BottomNav";
import AppShellHostAPI from "../lib/appShellHost/api";
import { checkOnboarding } from "../lib/storage";
import { ApiUser } from "../lib/types";
import useDelay from "../lib/useDelay";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebViewTerminatedEvent } from "react-native-webview/lib/WebViewTypes";

const { siteBaseUrl, originWhitelist } = Config;

export type RouteParams = {
  resetWebViewAfter?: number;
};

export type WebAppSignInScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "WebApp"
>;

export default function WebAppSigninScreen({ route, navigation }: WebAppSignInScreenProps) {
  const { resetWebViewAfter = 0 } = route.params || {};

  const appShellHost = useAppShellHost();

  const webviewRef = useRef<WebView>(null);
  useEffect(
    () => appShellHost.setWebView(webviewRef.current),
    [appShellHost, webviewRef.current]
  );

  const webviewKey = useResettableWebviewKey(resetWebViewAfter);

  const insets = useSafeAreaInsets();

  // https://github.com/react-native-webview/react-native-webview/issues/2199
  const onContentProcessDidTerminate = (syntheticEvent: WebViewTerminatedEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('Content process terminated, reloading', nativeEvent);
    webviewRef.current.reload();
  };

  const onCancelSignin = () => {
    navigation.navigate("Signin")
  };

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        // Skip top margin, taken care of by ConditionalTopNav
        marginLeft: insets.left,
        marginRight: insets.right,
        marginBottom: insets.bottom,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <TopNav title="Sign in with Email" leftIsBack onLeftPress={onCancelSignin} />
      <WebView
        key={webviewKey}
        source={{ uri: `${siteBaseUrl}/signinWithEmail` }}
        sharedCookiesEnabled={true}
        originWhitelist={originWhitelist}
        startInLoadingState={true}
        renderLoading={() => <Loader />}
        ref={webviewRef}
        onMessage={appShellHost.onMessage}
        onNavigationStateChange={appShellHost.onNavigationStateChange}
        onContentProcessDidTerminate={onContentProcessDidTerminate}
      />
    </View>
  );
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
