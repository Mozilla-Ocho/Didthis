import { useFonts } from "expo-font";

export default function useAppFonts() {
  const [fontsLoaded, fontError] = useFonts({
    "Solway-Bold": require("../assets/fonts/Solway/Solway-Bold.ttf"),
    "Solway-ExtraBold": require("../assets/fonts/Solway/Solway-ExtraBold.ttf"),
    "Solway-Light": require("../assets/fonts/Solway/Solway-Light.ttf"),
    "Solway-Medium": require("../assets/fonts/Solway/Solway-Medium.ttf"),
    "Solway-Regular": require("../assets/fonts/Solway/Solway-Regular.ttf"),

    "Rubik-MediumItalic": require("../assets/fonts/Rubik/static/Rubik-MediumItalic.ttf"),
    "Rubik-Bold": require("../assets/fonts/Rubik/static/Rubik-Bold.ttf"),
    "Rubik-SemiBoldItalic": require("../assets/fonts/Rubik/static/Rubik-SemiBoldItalic.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik/static/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik/static/Rubik-Medium.ttf"),
    "Rubik-ExtraBoldItalic": require("../assets/fonts/Rubik/static/Rubik-ExtraBoldItalic.ttf"),
    "Rubik-Black": require("../assets/fonts/Rubik/static/Rubik-Black.ttf"),
    "Rubik-Italic": require("../assets/fonts/Rubik/static/Rubik-Italic.ttf"),
    "Rubik-LightItalic": require("../assets/fonts/Rubik/static/Rubik-LightItalic.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik/static/Rubik-SemiBold.ttf"),
    "Rubik-BlackItalic": require("../assets/fonts/Rubik/static/Rubik-BlackItalic.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik/static/Rubik-ExtraBold.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik/static/Rubik-Regular.ttf"),
    "Rubik-BoldItalic": require("../assets/fonts/Rubik/static/Rubik-BoldItalic.ttf"),
  });

  return [fontsLoaded, fontError];
}
