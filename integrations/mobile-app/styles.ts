import { StyleSheet } from "react-native";
import { DefaultTheme, Theme } from "@react-navigation/native";

export const colors = {
  "yellow-100": "#fffce3",
  "yellow-300": "#fff1a6",
  "yellow-500": "#f4c005",
  "yellow-600": "#877538",
  "yellow-700": "#42370E",
  "yellow-home": "#fff968",
  "yellow-home-light": "rgba(255,255,255,0.8)",
  "black-100": "#E6E6E6",
  "black-200": "#CAC7C1",
  "black-300": "#757470",
  "black-500": "#47453E",
  "black-700": "#2C2727",
  white: "#ffffff",
  "charcoal-main": "#0d0d0d",
  "charcoal-medium": "#bcbcbc",
  "charcoal-light": "#3d3d3d",
  "gl-black": "#1f1f1f",
};

// https://reactnavigation.org/docs/themes
export const globalTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors["white"],
    primary: colors["yellow-600"],
  },
};

export const fonts = {
  logo: "Solway-Medium",
  heading: "Rubik-Bold",
  text: "Rubik-Regular",
};

export const styles = StyleSheet.create({
  textHeading: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: "700",
  },
  text: {
    fontFamily: fonts.text,
  },
  textLink: {
    textDecorationColor: "#000",
    textDecorationLine: "underline",
  },
  logoText: {
    color: colors["yellow-700"],
    fontFamily: fonts.logo,
    fontWeight: "500",
    fontSize: 49.396,
    letterSpacing: 0.988,
  },
  drawer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors["yellow-300"],
  },
  drawerButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: colors["yellow-500"],
    borderRadius: 48,
    padding: 24,
  },
});
