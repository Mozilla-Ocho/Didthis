import Constants from "expo-constants";
import useAppShellHost from "../lib/appShellHost";
import { useEffect, useRef, useState } from "react";
import WebView, { WebViewNavigation } from "react-native-webview";
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import WebViewNavToolbar from "../components/WebViewNavToolbar";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

const { siteBaseUrl, originWhitelist } = Constants.expoConfig.extra;

export type WebAppScreenRouteParams = {
  now: number;
  thingy: string;
};

export type WebAppScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "WebApp"
>;

export default function WebAppScreen(props: WebAppScreenProps) {
  const appShellHost = useAppShellHost();
  const { messaging } = appShellHost;

  const webviewRef = useRef<WebView>(null);
  useEffect(
    () => messaging.setWebView(webviewRef.current),
    [webviewRef.current]
  );

  const [webviewNavigation, setWebviewNavigation] = useState<
    WebViewNavigation | undefined
  >();

  const handleNavigationStateChange = (navState: WebViewNavigation) =>
    setWebviewNavigation(navState);

  const styles = StyleSheet.create({
    flexContainer: {
      flex: 1,
      justifyContent: "center",
    },
  });

  return (
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>
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
        onMessage={messaging.onMessage}
      />
      <WebViewNavToolbar
        webview={webviewRef.current}
        webviewNavigation={webviewNavigation}
      />
    </SafeAreaView>
  );
}
