import useAppShellHost from "../lib/appShellHost";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";
import { StatusBar, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Config from "../lib/config";
import Loader from "../components/Loader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebViewSource, WebViewTerminatedEvent } from "react-native-webview/lib/WebViewTypes";

const { originWhitelist } = Config;

export type AppShellWebViewProps = {
  resetWebViewAfter: number;
  source: WebViewSource;
  header?: () => ReactNode;
  footer?: () => ReactNode;
};

export default function AppShellWebView({
  resetWebViewAfter,
  source,
  header = () => null,
  footer = () => null,
}: AppShellWebViewProps) {
  const appShellHost = useAppShellHost();

  const webviewRef = useRef<WebView>(null);
  useEffect(
    () => appShellHost.setWebView(webviewRef.current),
    [appShellHost, webviewRef.current]
  );

  const webviewKey = useResettableWebviewKey(resetWebViewAfter);

  const insets = useSafeAreaInsets();

  // https://github.com/react-native-webview/react-native-webview/issues/2199
  const onContentProcessDidTerminate = (
    syntheticEvent: WebViewTerminatedEvent
  ) => {
    const { nativeEvent } = syntheticEvent;
    console.warn("Content process terminated, reloading", nativeEvent);
    webviewRef.current.reload();
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
      {header()}
      <WebView
        key={webviewKey}
        source={source}
        sharedCookiesEnabled={true}
        originWhitelist={originWhitelist}
        startInLoadingState={true}
        renderLoading={() => <Loader />}
        ref={webviewRef}
        onMessage={appShellHost.onMessage}
        onNavigationStateChange={appShellHost.onNavigationStateChange}
        onContentProcessDidTerminate={onContentProcessDidTerminate}
      />
      {footer()}
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
