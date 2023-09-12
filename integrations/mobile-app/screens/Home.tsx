import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Constants from "expo-constants";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import type { RootStackParamList } from "../App";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import WebView, { WebViewNavigation } from "react-native-webview";

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

export default function HomeScreen(props: HomeScreenProps) {
  const { navigation } = props;

  const webviewRef = useRef<WebView>(null);
  const [webviewNavigation, setWebviewNavigation] = useState<
    WebViewNavigation | undefined
  >();

  /*
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Go to Projects"
          onPress={() =>
            navigation.navigate("Projects", { now: Date.now(), thingy: "yup" })
          }
        />
      ),
    });
  }, [navigation]);
  */

  const handleWebViewNavigationStateChange = (navState: WebViewNavigation) =>
    setWebviewNavigation(navState);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
      <WebViewNavToolbar
        webview={webviewRef.current}
        webviewNavigation={webviewNavigation}
      />
      {/*
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen: {JSON.stringify(props)}</Text>
      <Text>Count: {count}</Text>
      <Button
        title="Go to Didthis"
        onPress={() =>
          navigation.navigate("DidthisWeb", { now: Date.now(), thingy: "yup" })
        }
      />
      <Button
        title="Go to Projects"
        onPress={() =>
          navigation.navigate("Projects", { now: Date.now(), thingy: "yup" })
        }
      />
    </View>
      */}
    </SafeAreaView>
  );
}
