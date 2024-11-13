import { StyleSheet } from "react-native";
import useAppFonts from "../lib/fonts";
import Loader from "../components/Loader";

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

export const decorators = [
  (Story) => {
    const [fontsLoaded, fontError] = useAppFonts();
    if (!fontsLoaded) {
      return <Loader />;
    }
    if (fontError) {
      console.error(fontError);
    }
    return <Story />;
  },
];
