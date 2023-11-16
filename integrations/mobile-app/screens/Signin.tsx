import { View, Text, Image, SafeAreaView, StyleSheet } from "react-native";
import AppleSigninButton from "../components/AppleSigninButton";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { styles as globalStyles, colors } from "../styles";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Storage from "../lib/storage";
import * as SiteAPI from "../lib/siteApi";
import * as Linking from 'expo-linking';
import config from '../lib/config';

export type SigninScreenRouteParams = {};

export type SigninScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "Signin"
>;

export default function SigninScreen({ navigation }: SigninScreenProps) {
  const onSignin = async (
    credential: AppleAuthentication.AppleAuthenticationCredential
  ) => {
    try {
      // HACK: Not sharing cookies between app & webview, need to sign-in with both
      await SiteAPI.signinWithCredential(credential);
      const onboardingCompleted = await Storage.getItem("ONBOARDING_COMPLETED");
      if (onboardingCompleted === "true") {
        navigation.navigate("WebApp", { credential });
      } else {
        navigation.navigate("Onboarding", { credential });
      }
    } catch (e) {
      // TODO: report sign-in error better
      alert("Sign-in failed, please try again later.");
      console.error("SIGN IN FAILED", e);
    }
  };

  const handleLegalTerms = () => Linking.openURL(config.legalUrls.terms)
  const handleLegalPrivacy = () => Linking.openURL(config.legalUrls.privacy)
  const handleLegalContent = () => Linking.openURL(config.legalUrls.content)

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
        <AppleSigninButton {...{ onSignin }} />
      </View>
      <Text style={[styles.text, styles.textLegalLink]} onPress={handleLegalTerms}>
        Terms of service
      </Text>
      <Text style={[styles.text, styles.textLegalLink]} onPress={handleLegalPrivacy}>
        Privacy notice
      </Text>
      <Text style={[styles.text, styles.textLegalLink]} onPress={handleLegalContent}>
        Content policies
      </Text>
    </SafeAreaView>
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
  textIntro: {
    marginHorizontal: 64,
    flexDirection: "row",
    textAlign: "center",
  },
  textLegalLink: {
    color: 'blue',
    fontSize: 17,
    marginBottom: 15,
  },
  signinContainer: {
    marginVertical: 24,
    marginHorizontal: 12,
  },
  textNoAccountLink: {
    marginVertical: 24,
    marginHorizontal: 12,
  },
});
