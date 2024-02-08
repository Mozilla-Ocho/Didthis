import useAppShellHost from "../lib/appShellHost";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import Config from "../lib/config";
import Loader from "../components/Loader";
import * as AppleAuthentication from "expo-apple-authentication";
import { ConditionalTopNav } from "../components/TopNav";
import { ConditionalBottomNav } from "../components/BottomNav";
import AppShellHostAPI from "../lib/appShellHost/api";
import { checkOnboarding } from "../lib/storage";
import useDelay from "../lib/useDelay";
import AppShellWebView from "../components/AppShellWebView";

const { siteBaseUrl } = Config;

export type WebAppScreenRouteParams = {
  credential?: AppleAuthentication.AppleAuthenticationCredential;
  resetWebViewAfter?: number;
};

export type WebAppScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "WebApp"
>;

export default function WebAppScreen({ route, navigation }: WebAppScreenProps) {
  const { credential, resetWebViewAfter = 0 } = route.params || {};

  return (
    <AppShellWebView
      source={{ uri: siteBaseUrl }}
      resetWebViewAfter={resetWebViewAfter}
      header={() => <ConditionalTopNav />}
      footer={() => (
        <>
          <ConditionalBottomNav />
          <WaitingForUserLoader />
          <AuthAndOnboardingCheck {...{ credential, navigation }} />
        </>
      )}
    />
  );
}

// This empty component lives in the footer, so it has access to the app
// shell host with populated webviewRef via useAppShellHost hook
function AuthAndOnboardingCheck({
  credential,
  navigation,
}: {
  credential?: AppleAuthentication.AppleAuthenticationCredential;
  navigation: StackNavigationProp<RootStackParamList, "WebApp", undefined>;
}) {
  const appShellHost = useAppShellHost();
  const user = appShellHost.state?.user;

  // Send the user off to onboarding once signed in, if necessary.
  useEffect(() => {
    if (!user) return;
    checkOnboarding().then((onboardingCompleted) => {
      if (!onboardingCompleted) navigation.navigate("Onboarding");
    });
  }, [user, navigation]);

  // Send Apple credential to web content, so we can trigger loginWithAppleId
  // if we're not already logged in
  useSendAppleCredentialToWebContent(credential, appShellHost);

  return null;
}

/**
 * Kind of a hacky component to display a loader over everything until
 * we have a signed-in user available from web content.
 */
function WaitingForUserLoader() {
  const appShellHost = useAppShellHost();

  // HACK: Give it a small delay, once user is available before hiding loader
  const { user } = appShellHost.state;
  const hideLoader = useDelay({ active: !!user, delay: 100 });
  if (hideLoader) return <></>;

  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "rgba(255, 255, 255, 1.0)",
      }}
    >
      <Loader />
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
