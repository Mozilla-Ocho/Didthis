import { View, TouchableOpacity, StyleSheet } from "react-native";
import Constants from "expo-constants";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons/faHome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons/faRotateRight";

const { siteBaseUrl: siteBaseUrlDefault } = Constants.expoConfig.extra;

export type WebViewNavToolbarProps = {
  siteBaseUrl?: string;
  webview?: {
    reload: () => void;
    goBack: () => void;
    goForward: () => void;
    injectJavaScript: (script: string) => void;
  };
  webviewNavigation?: {
    canGoBack?: boolean;
    canGoForward?: boolean;
    url?: string;
  };
  showReload?: boolean;
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: "center",
  },
  tabBarContainer: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff1a6",
  },
  toolbarButton: {
    padding: 4,
  },
});

export default function WebViewNavToolbar({
  siteBaseUrl = siteBaseUrlDefault,
  webview,
  webviewNavigation: { canGoBack = false, canGoForward = false } = {},
  showReload = false,
}: WebViewNavToolbarProps) {
  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity
        onPress={() => webview && webview.goBack()}
        style={{ ...styles.toolbarButton, opacity: canGoBack ? 1.0 : 0.1 }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.toolbarButton}
        onPress={() =>
          webview &&
          webview.injectJavaScript(`window.location = "${siteBaseUrl}"`)
        }
      >
        <FontAwesomeIcon icon={faHome} />
      </TouchableOpacity>
      {showReload && (
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={() => webview && webview.reload()}
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => webview && webview.goForward()}
        style={{ ...styles.toolbarButton, opacity: canGoForward ? 1.0 : 0.1 }}
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </TouchableOpacity>
    </View>
  );
}
