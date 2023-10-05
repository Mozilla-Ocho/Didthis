import { StyleSheet } from "react-native";

export const colors = {
  "yellow-100": "#fffce3",
  "yellow-300": "#fff1a6",
  "yellow-500": "#f4c005",
  "yellow-600": "#877538",
  "yellow-700": "#42370E",
  "yellow-home": "#fff968",
  "yellow-home-light": "rgba(255,255,255,0.8)",
  "black-100": "#E6E6E6",
  "black-300": "#757470",
  "black-500": "#47453E",
  "black-700": "#2C2727",
  white: "#ffffff",
  "charcoal-main": "#0d0d0d",
  "charcoal-light": "#3d3d3d",
  "gl-black": "#1f1f1f",
};

export const styles = StyleSheet.create({
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
