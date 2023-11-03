import "react-native-gesture-handler";
import * as React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import WebAppScreen, { WebAppScreenRouteParams } from "./screens/WebApp";
import SigninScreen, { SigninScreenRouteParams } from "./screens/Signin";
import StartupScreen, { StartupScreenRouteParams } from "./screens/Startup";
import { createStackNavigator } from "@react-navigation/stack";
import AppShellHostContextProvider from "./lib/appShellHost/context";
import Config from "./lib/config";
import useAppFonts from "./lib/fonts";
import LogoLoader from "./components/LogoLoader";
import { colors } from "./styles";

export type RootStackParamList = {
  Startup: StartupScreenRouteParams;
  Signin: SigninScreenRouteParams;
  WebApp: WebAppScreenRouteParams;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const [fontsLoaded, fontError] = useAppFonts();

  if (!fontsLoaded) {
    return <LogoLoader />;
  }
  if (fontError) {
    console.error(fontError);
  }

  // https://reactnavigation.org/docs/themes
  const globalTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors["white"],
      primary: colors["yellow-600"]
    }
  }

  return (
    <NavigationContainer theme={globalTheme}>
      <AppShellHostContextProvider>
        <AppMainStack />
      </AppShellHostContextProvider>
    </NavigationContainer>
  );
}

type AppMainStackProps = {};

function AppMainStack({}: AppMainStackProps) {
  return (
    <Stack.Navigator
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Startup" component={StartupScreen} />
      <Stack.Screen name="Signin" component={SigninScreen} />
      <Stack.Screen name="WebApp" component={WebAppScreen} />
    </Stack.Navigator>
  );
}

let AppEntryPoint = App;

if (Config.storybookEnabled) {
  AppEntryPoint = require("./.storybook").default;
}

export default AppEntryPoint;
