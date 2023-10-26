import { View, Text, Image, SafeAreaView, StyleSheet } from "react-native";
import AppleSigninButton from "../components/AppleSigninButton";
import Config from "../lib/config";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { styles as globalStyles, colors, fonts } from "../styles";
import useAppFonts from "../lib/fonts";

const { siteBaseUrl, originWhitelist } = Config;

export type SigninScreenRouteParams = {};

export type SigninScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "WebApp"
>;

export default function SigninScreen(props: SigninScreenProps) {
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
        <AppleSigninButton />
      </View>
      <Text style={[styles.text]}>or</Text>
      <Text style={[styles.text, styles.textNoAccountLink]}>
        Use Didthis without an account
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
    marginVertical: 16,
  },
  text: {
    ...globalStyles.text,
  },
  textIntro: {
    marginHorizontal: 64,
    flexDirection: "row",
    textAlign: "center",
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
