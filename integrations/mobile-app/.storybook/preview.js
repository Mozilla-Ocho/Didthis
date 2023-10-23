import { View, SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../styles";

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const styles = StyleSheet.create({
  previewWrapper: {
    ...StyleSheet.absoluteFillObject,
    margin: 0,
    padding: 0,
  },
});

export const decorators = [(Story) => <Story />];
