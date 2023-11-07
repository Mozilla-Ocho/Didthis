import { View, Text, Image, SafeAreaView, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { styles as globalStyles, colors } from "../styles";
import * as Storage from "../lib/storage";
import LogoLoader from "../components/LogoLoader";
import { useEffect } from "react";
import Config from "../lib/config";
import * as SiteAPI from "../lib/siteApi";

const { siteBaseUrl } = Config;
const loginApiUrl = `${siteBaseUrl}/api/sessionLoginWithAppleId`;

export type StartupScreenRouteParams = {};

export type StartupScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "WebApp"
>;

export default function StartupScreen({ navigation }: StartupScreenProps) {
  useEffect(() => {
    SiteAPI.fetchSignedInUser().then((apiUser) => {
      navigation.navigate("WebApp");
    }).catch(err => {
      navigation.navigate("Signin");
    })
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <LogoLoader />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors["white"],
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
