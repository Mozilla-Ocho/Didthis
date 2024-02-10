import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet, TouchableOpacity
} from "react-native";
import AppleSigninButton from "../components/AppleSigninButton";
import { StackScreenProps } from "@react-navigation/stack";
import { A } from "@expo/html-elements";
import { RootStackParamList } from "../App";
import { styles as globalStyles, fonts, colors } from "../styles";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SiteAPI from "../lib/siteApi";
import config from "../lib/config";
import { useState } from "react";
import ActivityIndicator from "../components/ActivityIndicator";
import { TouchableHighlight } from "react-native-gesture-handler";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";

export type SigninScreenRouteParams = {};

export type SigninScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "Signin"
>;

type SigninStatus = undefined | "inprogress" | "success" | "error";

export default function SigninScreen({ navigation }: SigninScreenProps) {
  const [signinStatus, setSigninStatus] = useState<SigninStatus>();

  const onAppleSigninPress = () => setSigninStatus("inprogress");

  const onAppleSigninError = () => setSigninStatus("error");

  const onAppleSigninCancel = () => setSigninStatus(undefined);

  const onAppleSignin = async (
    credential: AppleAuthentication.AppleAuthenticationCredential
  ) => {
    try {
      // HACK: Not sharing cookies between app & webview, need to sign-in with both
      await SiteAPI.signinWithCredential(credential);
      setSigninStatus("success");
      navigation.navigate("WebApp", {
        credential,
        resetWebViewAfter: Date.now(),
      });
    } catch (e) {
      setSigninStatus("error");
      console.error("SIGN IN FAILED", e);
    }
  };

  const onEmailSigninPress = () => {
    navigation.navigate("WebAppSignin")
  };

  const onAppInfoPress = () => {
    navigation.navigate("AppInfo");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/didthis-logo-nobg.png")}
        />
      </View>
      <View style={styles.logoTitleContainer}>
        <Text style={styles.logoTitleText}>Didthis</Text>
      </View>
      <Text style={styles.textIntroTitle}>Sign in</Text>
      <Text style={[styles.text, styles.textIntro]}>
        Signing in with an account lets you keep track of your projects and
        updates.
      </Text>
      <View style={styles.signinContainer}>
        <AppleSigninButton
          onPress={onAppleSigninPress}
          onError={onAppleSigninError}
          onCancel={onAppleSigninCancel}
          onSignin={onAppleSignin}
        />
        <EmailSigninButton onPress={onEmailSigninPress} />
      </View>
      <View style={styles.footerLinksContainer}>
        <A href={config.legalUrls.privacy} style={styles.footerLink}>
          Privacy policy
        </A>
        <A href={config.legalUrls.terms} style={styles.footerLink}>
          Terms and conditions
        </A>
        <A href={config.legalUrls.content} style={styles.footerLink}>
          Content policies
        </A>
        <TouchableHighlight onPress={onAppInfoPress}>
          <Text style={styles.footerLink}>App info</Text>
        </TouchableHighlight>
      </View>
      {signinStatus === "inprogress" && (
        <ActivityIndicator label="Signing In" />
      )}
      {signinStatus === "success" && (
        <ActivityIndicator spinner={false} label="Success!" />
      )}
      {signinStatus === "error" && (
        <ActivityIndicator
          intent="error"
          spinner={false}
          label="We ran into a problem. Try again"
        />
      )}
    </SafeAreaView>
  );
}

function EmailSigninButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.emailSigninButton} onPress={onPress}>
      <FontAwesomeIcon icon={faEnvelope} style={{ padding: 4 }} />
      <Text style={styles.emailSigninButtonLabel}>Sign in with Email</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors["yellow-100"],
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 9.88,
    // balances the marginTop in footerLinksContainer
    marginTop: 48,
  },
  logo: { width: 185, height: 185 },
  logoTitleContainer: {
    marginBottom: 48,
  },
  logoTitleText: {
    ...globalStyles.logoText,
  },
  textIntroTitle: {
    ...globalStyles.textHeading,
    marginBottom: 16,
  },
  text: {
    ...globalStyles.text,
  },
  textLink: {
    ...globalStyles.textLink,
  },
  textIntro: {
    marginHorizontal: 64,
    flexDirection: "row",
    textAlign: "center",
  },
  textLegalLink: {
    color: "blue",
    fontSize: 17,
    marginBottom: 15,
  },
  signinContainer: {
    marginTop: 24,
    marginHorizontal: 12,
  },
  footerLinksContainer: {
    marginTop: 48,
  },
  footerLink: {
    ...globalStyles.textLink,
    marginVertical: 6,
    textAlign: "center",
  },
  emailSigninButton: {
    ...globalStyles.button,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    borderRadius: 6,
    marginVertical: 8,
    padding: 14,
  },
  emailSigninButtonLabel: {
    ...globalStyles.buttonLabel,
    paddingLeft: 6,
    fontFamily: fonts.system,
    fontSize: 24,
    fontWeight: "600"
  },
});
